import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { HabitPayload } from "@/types";

export async function GET() {
  const { data, error } = await supabase.from("habits").select("*").order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as HabitPayload;

  if (!payload.name || payload.name.length > 100) {
    return NextResponse.json({ message: "Name is required and must be under 100 characters." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("habits")
    .insert({
      ...payload,
      description: payload.description ?? "",
      archived: payload.archived ?? false,
      weekly_days: payload.weekly_days ?? [],
      monthly_days: payload.monthly_days ?? [],
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

