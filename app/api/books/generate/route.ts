import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { GenerateBookCodeRequest } from "@/lib/types";
import crypto from "crypto";
import { NextApiRequest } from "next";
import { encodeGeoHash } from "@/lib/geohash";
import { DISAMBIGUATED_CHARS } from "@/lib/utils";
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

const LENGTH = 5;
export async function POST(request: Request) {
  try {
    const {
      location: { lat, long },
    } = await request.json();
    const locationString = `${lat},${long}`;
    const hash = crypto
      .createHash("sha256")
      .update(locationString)
      .digest("hex");
    let num = BigInt("0x" + hash);

    let code = "";
    for (let i = 0; i < LENGTH; i++) {
      const index = Number(num % BigInt(DISAMBIGUATED_CHARS.length));
      code += DISAMBIGUATED_CHARS[index];
      num = num / BigInt(DISAMBIGUATED_CHARS.length);
    }
    // const cookieStore = cookies();
    // const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // const { data: { user }, error: authError } = await supabase.auth.getUser();
    // if (authError || !user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // const { data, error } = await supabase
    //   .from('sighting')
    //   .insert({
    //     book_id: bookId,
    //     user_id: user.id,
    //     location,
    //     date: Date.now(),
    //   })
    //   .select()
    //   .single();

    // if (error) throw error;

    // [w3gw] Location Code + [code] Book Code
    const geoHash = encodeGeoHash(lat, long).slice(0, 4);
    const bookHash = code;

    return NextResponse.json({ code: `${geoHash}${bookHash}` });
  } catch (error) {
    console.error("Error generating a book code:", error);
    return NextResponse.json(
      { error: "Failed to create code" },
      { status: 500 }
    );
  }
}
