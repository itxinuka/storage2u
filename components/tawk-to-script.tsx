"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void
      showWidget?: () => void
      onLoad?: () => void
    }
  }
}

function shouldHideTawk(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/ops" ||
    pathname.startsWith("/ops/")
  )
}

function syncTawkVisibility(hide: boolean) {
  const api = window.Tawk_API
  if (!api) return

  if (hide) {
    api.hideWidget?.()
  } else {
    api.showWidget?.()
  }
}

export function TawkToScript() {
  const pathname = usePathname()
  const hide = shouldHideTawk(pathname)
  const [shouldLoad, setShouldLoad] = useState(() => !hide)

  useEffect(() => {
    if (!hide) setShouldLoad(true)
  }, [hide])

  useEffect(() => {
    syncTawkVisibility(hide)

    const api = window.Tawk_API
    if (!api) return

    const previousOnLoad = api.onLoad
    api.onLoad = () => {
      previousOnLoad?.()
      syncTawkVisibility(shouldHideTawk(window.location.pathname))
    }

    return () => {
      api.onLoad = previousOnLoad
    }
  }, [hide])

  if (!shouldLoad) return null

  return (
    <Script id="tawk-to" strategy="afterInteractive">{`
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    Tawk_API.onLoad = function(){
      var path = window.location.pathname;
      var hide = path === "/dashboard" || path.indexOf("/dashboard/") === 0
        || path === "/ops" || path.indexOf("/ops/") === 0;
      if (hide && typeof Tawk_API.hideWidget === "function") Tawk_API.hideWidget();
    };
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/6a5429378ba18a1d4a7d7e88/1jtcc20af';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
`}</Script>
  )
}
