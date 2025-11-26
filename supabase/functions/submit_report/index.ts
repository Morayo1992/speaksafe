import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateAccessCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

    const formData = await req.formData();
    const typeOfIncident = formData.get("typeOfIncident") as string;
    const description = formData.get("description") as string;
    const incidentDate = formData.get("incidentDate") as string;
    const location = formData.get("location") as string || null;
    const supportNeeded = formData.get("supportNeeded") as string;
    const files = formData.getAll("files") as File[];

    const accessCode = generateAccessCode();

    const { data: report, error: reportError } = await supabase
      .from("reports")
      .insert([
        {
          type_of_incident: typeOfIncident,
          description: description,
          incident_date: incidentDate,
          location: location,
          support_needed: supportNeeded,
          access_code: accessCode,
          status: "new",
        },
      ])
      .select()
      .single();

    if (reportError) {
      throw new Error(`Failed to create report: ${reportError.message}`);
    }

    for (const file of files) {
      if (file && file.size > 0) {
        const fileBuffer = await file.arrayBuffer();
        const fileName = `${report.id}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(fileName, fileBuffer, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error(`Failed to upload file: ${uploadError.message}`);
          continue;
        }

        const { error: fileRecordError } = await supabase
          .from("evidence_files")
          .insert([
            {
              report_id: report.id,
              file_name: file.name,
              file_path: fileName,
              file_size: file.size,
            },
          ]);

        if (fileRecordError) {
          console.error(`Failed to record file: ${fileRecordError.message}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        accessCode: accessCode,
        reportId: report.id,
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
