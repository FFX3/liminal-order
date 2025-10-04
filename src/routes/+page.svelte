<script>
    const redirect_uri = "https://wwubrvsbuhzlpymjgjvw.supabase.co/functions/v1/eve-sso-login"
    const client_id = "72743549513a4d14a7a37102d468ae0c"

    const state = JSON.stringify({
        app_url: "http://localhost:5173"
    })

    // Edit scopes https://developers.eveonline.com/applications/details/72743549 
    const scope = encodeURI([
        "esi-skills.read_skills.v1",
        "esi-markets.read_character_orders.v1"
    ].join(" "))
</script>


<div class="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    <main class="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
    <div class="flex gap-4 items-center flex-col sm:flex-row">
        <a href={`https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${redirect_uri}&client_id=${client_id}&state=${state}&scope=${scope}`}>
        <img
            src="/eve-sso-login-white-large.png"
            alt="ESI Login"
            width={270}
            height={45}
        />
        </a>
    </div>
    </main>
</div>
["esi-skills.read_skills.v1","esi-markets.read_character_orders.v1"]
