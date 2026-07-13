export function TawkToScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/6a5429378ba18a1d4a7d7e88/1jtcc20af';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
`,
      }}
    />
  )
}
