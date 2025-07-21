"use client"
import { useSearchParams } from "next/navigation"
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json())

function parseJwt(token: string) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));

}

function useEsiResponse() {
    const searchParams = useSearchParams()
    const esiTokenData = JSON.parse(searchParams.get("esiTokenData") as string)
    const jwt = parseJwt(esiTokenData.access_token)
    return {
        response: esiTokenData,
        parsedJWT: jwt
    }
}

function useCharacterInfo() {
    const { parsedJWT } = useEsiResponse()
    return {
        id: parsedJWT.sub.split(":")[2],
        name: parsedJWT.name
    }
}

function useCharacterPortrait(): {
    px128x128: string
    px256x256: string
    px512x512: string
    px64x64: string
} | null {
    const { id }  =  useCharacterInfo()
    const { data } = useSWR(`https://esi.evetech.net/latest/characters/${id}/portrait/?datasource=tranquility`, fetcher)
    return data
}

function EsiTokenData() {
    const { response, parsedJWT } = useEsiResponse()
    const characterInfo  =  useCharacterInfo()
    return <pre className="overflow-x-scroll">
        CharacterID: {characterInfo.id}, Name: {characterInfo.name}
        <br />
        JWT: {JSON.stringify(parsedJWT, null, 2)}
        <br />
        ESI Response: {JSON.stringify(response, null, 2)}
    </pre>
}

function CharacterPortrait(props: { size: 64 | 128 | 256 | 512 }) {
    const portrait = useCharacterPortrait()
    if(!portrait) {
        return <div style={{ width: props.size, height: props.size }} />
    }
    const keyMapping = {
        128: "px128x128",
        256: "px256x256",
        512: "px512x512",
        64: "px64x64"
    }
    return <div style={{ width: props.size, height: props.size }} >
        <img
            aria-hidden
            src={portrait[keyMapping[props.size]]}
            alt="Character portrait"
            width={props.size}
            height={props.size}
        />
    </div>
}

export default function Dashboard() {
    return <main>
        <CharacterPortrait size={512} />
        <EsiTokenData />
    </main>

}