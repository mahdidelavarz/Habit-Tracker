import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface RouteParams {
  params: { id: string };
}

export async function DELETE(_: Request, { params }: RouteParams) {
  const { error } = await supabase.from("habit_completions").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

