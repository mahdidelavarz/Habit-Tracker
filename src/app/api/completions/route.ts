import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const habitId = searchParams.get("habit_id");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  if (!habitId || !startDate || !endDate) {
    return NextResponse.json({ message: "Missing required parameters." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .gte("completion_date", startDate)
    .lte("completion_date", endDate)
    .order("completion_date", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { habit_id, completion_date } = body ?? {};

  if (!habit_id || !completion_date) {
    return NextResponse.json({ message: "habit_id and completion_date are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("habit_completions")
    .insert({ habit_id, completion_date })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

