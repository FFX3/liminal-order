import Image from "next/image";

const redirect_uri = "https://wwubrvsbuhzlpymjgjvw.supabase.co/functions/v1/eve-sso-login"
const client_id = "72743549513a4d14a7a37102d468ae0c"

export default function Home() {
  const state = JSON.stringify({
    app_url: process.env.NEXT_PUBLIC_APP_URL
  })
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a href={`https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${redirect_uri}&client_id=${client_id}&state=${state}`}>
          <Image
            aria-hidden
            src="/eve-sso-login-white-large.png"
            alt="ESI Login"
            width={270}
            height={45}
          />
          </a>
        </div>
      </main>
    </div>
  );
}
