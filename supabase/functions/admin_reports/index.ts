import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === "GET") {
      const url = new URL(req.url);
      const status = url.searchParams.get("status");
      const startDate = url.searchParams.get("startDate");
      const endDate = url.searchParams.get("endDate");

      let query = supabase.from("reports").select();

      if (status) {
        query = query.eq("status", status);
      }

      if (startDate) {
        query = query.gte("created_at", startDate);
      }

      if (endDate) {
        query = query.lte("created_at", endDate);
      }

      const { data: reports, error: reportsError } = await query.order(
        "created_at",
        { ascending: false }
      );

      if (reportsError) {
        throw new Error(`Failed to fetch reports: ${reportsError.message}`);
      }

      const reportsWithFiles = await Promise.all(
        reports.map(async (report) => {
          const { data: files } = await supabase
            .from("evidence_files")
            .select()
            .eq("report_id", report.id);

          return {
            id: report.id,
            typeOfIncident: report.type_of_incident,
            description: report.description,
            incidentDate: report.incident_date,
            location: report.location,
            supportNeeded: report.support_needed,
            accessCode: report.access_code,
            status: report.status,
            createdAt: report.created_at,
            fileCount: files?.length || 0,
          };
        })
      );

      return new Response(JSON.stringify({ success: true, reports: reportsWithFiles }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    } else if (req.method === "PATCH") {
      const { reportId, status: newStatus } = await req.json();

      if (!reportId || !newStatus) {
        return new Response(
          JSON.stringify({ error: "reportId and status are required" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { data, error } = await supabase
        .from("reports")
        .update({ status: newStatus })
        .eq("id", reportId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update report: ${error.message}`);
      }

      return new Response(
        JSON.stringify({ success: true, report: data }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
