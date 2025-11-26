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

    const url = new URL(req.url);
    const accessCode = url.searchParams.get("accessCode");

    if (!accessCode) {
      return new Response(
        JSON.stringify({ error: "Access code is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select()
      .eq("access_code", accessCode)
      .maybeSingle();

    if (reportError) {
      throw new Error(`Failed to fetch report: ${reportError.message}`);
    }

    if (!report) {
      return new Response(
        JSON.stringify({ error: "Report not found" }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: files, error: filesError } = await supabase
      .from("evidence_files")
      .select()
      .eq("report_id", report.id);

    if (filesError) {
      throw new Error(`Failed to fetch files: ${filesError.message}`);
    }

    const fileUrls = files.map((file) => ({
      id: file.id,
      fileName: file.file_name,
      filePath: file.file_path,
      downloadUrl: `${supabaseUrl}/storage/v1/object/public/evidence/${file.file_path}`,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        report: {
          id: report.id,
          typeOfIncident: report.type_of_incident,
          description: report.description,
          incidentDate: report.incident_date,
          location: report.location,
          supportNeeded: report.support_needed,
          createdAt: report.created_at,
        },
        files: fileUrls,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
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
