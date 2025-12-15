"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
// We'll fetch table info directly from Supabase

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  table: string;
}

interface TableInfo {
  name: string;
  description: string;
}

export default function ApiDocsSimplePage() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");

  const knownTables: TableInfo[] = [
    { name: "users", description: "User accounts" },
    { name: "user_profiles", description: "Extended user profile information" },
    { name: "player_profiles", description: "Player-specific profile data" },
    { name: "coach_profiles", description: "Coach-specific profile data" },
    { name: "subscription_plans", description: "Available subscription plans" },
    { name: "user_subscriptions", description: "User subscription records" },
    { name: "subscription_history", description: "Subscription change history" },
    { name: "content_items", description: "Content items (videos, articles, courses)" },
    { name: "content_sections", description: "Content organization sections" },
    { name: "content_section_items", description: "Links content items to sections" },
    { name: "user_content_progress", description: "User progress through content" },
    { name: "user_level_progress", description: "User level completion tracking" },
  ];

  useEffect(() => {
    const loadApiDocs = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        setSupabaseUrl(url);

        if (!url) {
          setError("Supabase URL not configured");
          setLoading(false);
          return;
        }

        // Generate endpoints for each table
        const generatedEndpoints: ApiEndpoint[] = [];

        knownTables.forEach((table) => {
          const tableName = table.name;

          // GET - List all
          generatedEndpoints.push({
            method: "GET",
            path: `/rest/v1/${tableName}`,
            description: `List all ${tableName} records`,
            table: tableName,
          });

          // GET - Single record
          generatedEndpoints.push({
            method: "GET",
            path: `/rest/v1/${tableName}?id=eq.{id}`,
            description: `Get a single ${tableName} record by ID`,
            table: tableName,
          });

          // POST - Create
          generatedEndpoints.push({
            method: "POST",
            path: `/rest/v1/${tableName}`,
            description: `Create a new ${tableName} record`,
            table: tableName,
          });

          // PATCH - Update
          generatedEndpoints.push({
            method: "PATCH",
            path: `/rest/v1/${tableName}?id=eq.{id}`,
            description: `Update a ${tableName} record`,
            table: tableName,
          });

          // DELETE - Delete
          generatedEndpoints.push({
            method: "DELETE",
            path: `/rest/v1/${tableName}?id=eq.{id}`,
            description: `Delete a ${tableName} record`,
            table: tableName,
          });
        });

        setEndpoints(generatedEndpoints);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load API documentation");
      } finally {
        setLoading(false);
      }
    };

    loadApiDocs();
  }, []);

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-300";
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "PATCH":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.table]) {
      acc[endpoint.table] = [];
    }
    acc[endpoint.table].push(endpoint);
    return acc;
  }, {} as Record<string, ApiEndpoint[]>);

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 my-3 md:my-4 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ProBuilt API Documentation
            </h1>
            <p className="text-gray-600 text-lg">
              Auto-generated REST API documentation from Supabase PostgREST
            </p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Base URL:</strong> {supabaseUrl || "Not configured"}
                <br />
                <strong>Authentication:</strong> Include your API key in the{" "}
                <code className="bg-blue-100 px-1 rounded">apikey</code> query parameter or{" "}
                <code className="bg-blue-100 px-1 rounded">Authorization</code> header
              </p>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
              <p className="ml-4 text-gray-600">Loading API documentation...</p>
            </div>
          )}

          {error && (
            <div className="py-20">
              <ErrorMessage message={error} />
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              {Object.entries(groupedEndpoints).map(([tableName, tableEndpoints]) => (
                <div
                  key={tableName}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gray-800 text-white px-6 py-4">
                    <h2 className="text-2xl font-bold capitalize">
                      {tableName.replace(/_/g, " ")}
                    </h2>
                    <p className="text-gray-300 text-sm mt-1">
                      Table: <code className="bg-gray-700 px-2 py-1 rounded">{tableName}</code>
                    </p>
                    {knownTables.find(t => t.name === tableName)?.description && (
                      <p className="text-gray-400 text-xs mt-2">
                        {knownTables.find(t => t.name === tableName)?.description}
                      </p>
                    )}
                  </div>

                  <div className="divide-y divide-gray-200">
                    {tableEndpoints.map((endpoint, idx) => (
                      <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <span
                            className={`px-3 py-1 rounded text-sm font-semibold border ${getMethodColor(
                              endpoint.method
                            )}`}
                          >
                            {endpoint.method}
                          </span>
                          <div className="flex-1">
                            <code className="text-lg font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded">
                              {endpoint.path}
                            </code>
                            <p className="text-gray-600 mt-2">{endpoint.description}</p>

                            {/* Example request */}
                            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                Example Request
                              </p>
                              <code className="text-sm text-gray-800 block">
                                {endpoint.method === "GET" && (
                                  <>
                                    {supabaseUrl}
                                    {endpoint.path.replace("{id}", "123")}
                                    {endpoint.path.includes("?") ? "&" : "?"}apikey=YOUR_API_KEY
                                  </>
                                )}
                                {endpoint.method === "POST" && (
                                  <>
                                    curl -X POST {supabaseUrl}
                                    {endpoint.path} \<br />
                                    &nbsp;&nbsp;-H "apikey: YOUR_API_KEY" \<br />
                                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                                    &nbsp;&nbsp;-d '{"{"}"data": "example"{"}"}'
                                  </>
                                )}
                                {endpoint.method === "PATCH" && (
                                  <>
                                    curl -X PATCH {supabaseUrl}
                                    {endpoint.path.replace("{id}", "123")} \<br />
                                    &nbsp;&nbsp;-H "apikey: YOUR_API_KEY" \<br />
                                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                                    &nbsp;&nbsp;-d '{"{"}"data": "updated"{"}"}'
                                  </>
                                )}
                                {endpoint.method === "DELETE" && (
                                  <>
                                    curl -X DELETE {supabaseUrl}
                                    {endpoint.path.replace("{id}", "123")} \<br />
                                    &nbsp;&nbsp;-H "apikey: YOUR_API_KEY"
                                  </>
                                )}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* API Info Footer */}
          <div className="mt-12 p-6 bg-gray-800 text-white rounded-lg">
            <h3 className="text-xl font-bold mb-4">API Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Authentication:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                  <li>Query parameter: <code className="bg-gray-700 px-1 rounded">?apikey=YOUR_KEY</code></li>
                  <li>Header: <code className="bg-gray-700 px-1 rounded">apikey: YOUR_KEY</code></li>
                  <li>Bearer token: <code className="bg-gray-700 px-1 rounded">Authorization: Bearer TOKEN</code></li>
                </ul>
              </div>
              <div>
                <strong>PostgREST Features:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                  <li>Filtering: <code className="bg-gray-700 px-1 rounded">?column=eq.value</code></li>
                  <li>Ordering: <code className="bg-gray-700 px-1 rounded">?order=column.asc</code></li>
                  <li>Pagination: <code className="bg-gray-700 px-1 rounded">?limit=10&offset=0</code></li>
                  <li>Select columns: <code className="bg-gray-700 px-1 rounded">?select=col1,col2</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

