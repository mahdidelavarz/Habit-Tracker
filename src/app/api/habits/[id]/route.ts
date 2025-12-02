import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { HabitPayload } from "@/types";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const body = (await request.json()) as Partial<HabitPayload>;
  const { data, error } = await supabase
    .from("habits")
    .update(body)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: RouteParams) {
  const { error } = await supabase.from("habits").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

