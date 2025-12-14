"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { FaExternalLinkAlt, FaCopy, FaCheck } from "react-icons/fa";

interface OpenApiPath {
  [method: string]: {
    summary?: string;
    description?: string;
    parameters?: any[];
    requestBody?: any;
    responses?: any;
  };
}

interface OpenApiSpec {
  openapi?: string;
  info?: {
    title?: string;
    description?: string;
    version?: string;
  };
  paths?: {
    [path: string]: OpenApiPath;
  };
  definitions?: {
    [key: string]: any;
  };
}

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<OpenApiSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpenApiSpec = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

        setSupabaseUrl(url);

        if (!url || !key) {
          setError("Supabase configuration missing. Please check your environment variables.");
          setLoading(false);
          return;
        }

        // Fetch OpenAPI spec from Supabase PostgREST
        const response = await fetch(`${url}/rest/v1/?apikey=${key}`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch API spec: ${response.statusText}`);
        }

        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load API documentation");
      } finally {
        setLoading(false);
      }
    };

    fetchOpenApiSpec();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-300";
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "PATCH":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "PUT":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50 pt-44 md:pt-48">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-4">Loading API documentation...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50 pt-44 md:pt-48 px-4">
          <div className="max-w-md w-full">
            <ErrorMessage message={error} />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const paths = spec?.paths || {};
  const definitions = spec?.definitions || {};

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
            <p className="text-gray-600 text-lg mb-4">
              Auto-generated REST API documentation from Supabase PostgREST
            </p>

            {/* API Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Base URL:</strong>
                  <br />
                  <code className="bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                    {supabaseUrl}/rest/v1
                  </code>
                  <button
                    onClick={() => copyToClipboard(`${supabaseUrl}/rest/v1`, "base-url")}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    {copied === "base-url" ? (
                      <FaCheck className="inline" />
                    ) : (
                      <FaCopy className="inline" />
                    )}
                  </button>
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>OpenAPI Spec:</strong>
                  <br />
                  <a
                    href={`${supabaseUrl}/rest/v1/?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 underline inline-flex items-center gap-1 mt-1"
                  >
                    View Raw Spec
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                </p>
              </div>
            </div>

            {/* Authentication */}
            <div className="p-4 bg-gray-800 text-white rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-3">Authentication</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Query Parameter:</strong>
                  <code className="block bg-gray-700 px-2 py-1 rounded mt-1">
                    ?apikey=YOUR_KEY
                  </code>
                </div>
                <div>
                  <strong>Header:</strong>
                  <code className="block bg-gray-700 px-2 py-1 rounded mt-1">
                    apikey: YOUR_KEY
                  </code>
                </div>
                <div>
                  <strong>Bearer Token:</strong>
                  <code className="block bg-gray-700 px-2 py-1 rounded mt-1">
                    Authorization: Bearer TOKEN
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Paths */}
          {Object.keys(paths).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(paths).map(([path, methods]) => {
                const tableName = path.replace("/rest/v1/", "").replace("/", "");
                return (
                  <div
                    key={path}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gray-800 text-white px-6 py-4">
                      <h2 className="text-2xl font-bold">
                        <code className="text-white">{path}</code>
                      </h2>
                      {tableName && (
                        <p className="text-gray-300 text-sm mt-1">
                          Table: <code className="bg-gray-700 px-2 py-1 rounded">{tableName}</code>
                        </p>
                      )}
                    </div>

                    <div className="divide-y divide-gray-200">
                      {Object.entries(methods).map(([method, details]) => (
                        <div key={method} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-4">
                            <span
                              className={`px-3 py-1 rounded text-sm font-semibold border ${getMethodColor(
                                method
                              )}`}
                            >
                              {method.toUpperCase()}
                            </span>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {details.summary || `${method} ${path}`}
                              </h3>
                              {details.description && (
                                <p className="text-gray-600 mb-4">{details.description}</p>
                              )}

                              {/* Example Request */}
                              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs font-semibold text-gray-500 uppercase">
                                    Example Request
                                  </p>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        `${supabaseUrl}${path}?apikey=YOUR_KEY`,
                                        `${path}-${method}`
                                      )
                                    }
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    {copied === `${path}-${method}` ? (
                                      <FaCheck className="text-green-600" />
                                    ) : (
                                      <FaCopy />
                                    )}
                                  </button>
                                </div>
                                <code className="text-sm text-gray-800 block break-all">
                                  {method.toUpperCase() === "GET" && (
                                    <span>
                                      {supabaseUrl}
                                      {path}?apikey=YOUR_KEY
                                    </span>
                                  )}
                                  {method.toUpperCase() === "POST" && (
                                    <span>
                                      curl -X POST {supabaseUrl}
                                      {path} \<br />
                                      &nbsp;&nbsp;-H "apikey: YOUR_KEY" \<br />
                                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                                      &nbsp;&nbsp;-d '{"{"}"data": "example"{"}"}'
                                    </span>
                                  )}
                                  {method.toUpperCase() === "PATCH" && (
                                    <span>
                                      curl -X PATCH {supabaseUrl}
                                      {path}?id=eq.123 \<br />
                                      &nbsp;&nbsp;-H "apikey: YOUR_KEY" \<br />
                                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                                      &nbsp;&nbsp;-d '{"{"}"data": "updated"{"}"}'
                                    </span>
                                  )}
                                  {method.toUpperCase() === "DELETE" && (
                                    <span>
                                      curl -X DELETE {supabaseUrl}
                                      {path}?id=eq.123 \<br />
                                      &nbsp;&nbsp;-H "apikey: YOUR_KEY"
                                    </span>
                                  )}
                                </code>
                              </div>

                              {/* Parameters */}
                              {details.parameters && details.parameters.length > 0 && (
                                <div className="mt-4">
                                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Parameters
                                  </p>
                                  <div className="space-y-2">
                                    {details.parameters.map((param: any, idx: number) => (
                                      <div key={idx} className="text-sm">
                                        <code className="bg-gray-100 px-2 py-1 rounded">
                                          {param.name}
                                        </code>
                                        <span className="text-gray-600 ml-2">
                                          ({param.in}) - {param.description || param.schema?.type}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No API paths found. Make sure your Supabase URL and API key are configured correctly.
              </p>
            </div>
          )}

          {/* PostgREST Features */}
          <div className="mt-12 p-6 bg-gray-800 text-white rounded-lg">
            <h3 className="text-xl font-bold mb-4">PostgREST Query Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <strong className="block mb-2">Filtering Operators:</strong>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li><code className="bg-gray-700 px-1 rounded">eq</code> - Equal</li>
                  <li><code className="bg-gray-700 px-1 rounded">neq</code> - Not equal</li>
                  <li><code className="bg-gray-700 px-1 rounded">gt</code> - Greater than</li>
                  <li><code className="bg-gray-700 px-1 rounded">gte</code> - Greater than or equal</li>
                  <li><code className="bg-gray-700 px-1 rounded">lt</code> - Less than</li>
                  <li><code className="bg-gray-700 px-1 rounded">like</code> - Pattern matching</li>
                  <li><code className="bg-gray-700 px-1 rounded">in</code> - In array</li>
                </ul>
              </div>
              <div>
                <strong className="block mb-2">Other Features:</strong>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li><code className="bg-gray-700 px-1 rounded">?order=column.asc</code> - Ordering</li>
                  <li><code className="bg-gray-700 px-1 rounded">?limit=10&offset=0</code> - Pagination</li>
                  <li><code className="bg-gray-700 px-1 rounded">?select=col1,col2</code> - Select columns</li>
                  <li><code className="bg-gray-700 px-1 rounded">?count=exact</code> - Get count</li>
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

