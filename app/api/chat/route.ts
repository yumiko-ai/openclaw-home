import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, files } = body;

    // TODO: Connect to OpenClaw API
    // For now, return a mock response
    // Real implementation would call: http://localhost:3000/api/chat or similar

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = {
      role: "assistant",
      content: `I received your message: "${message}". This is a placeholder response. Connect to the OpenClaw API to get real responses from Yumiko.`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
