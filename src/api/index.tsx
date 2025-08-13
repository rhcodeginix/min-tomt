/* eslint-disable @typescript-eslint/no-explicit-any */

const ApiUtils = {
  getAddress: async function (value: any) {
    try {
      const response = await fetch(
        `https://ws.geonorge.no/adresser/v1/sok?sok=${value}`
      );
      return response;
    } catch (error: any) {
      throw error.response;
    }
  },

  getSingleAddress: async function (params: Record<string, any>) {
    try {
      const url = `https://ws.geonorge.no/adresser/v1/sok?sok=${`${params.adressenavn} ${params.nummer}`}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error("Error fetching address:", error);
      throw error;
    }
  },
  getMunicipality: async function () {
    try {
      const response = await fetch(
        `https://api.test.kartverket.no/kommuneinfo/v1/kommuner`
      );
      return response;
    } catch (error: any) {
      throw error.response;
    }
  },
  callMatrikkelApi: async function () {
    const url =
      "https://prodtest.matrikkel.no/matrikkelapi/wsapi/v1/MatrikkelenhetServiceWS";
    const username = "nexon_matrikkeltest";
    const password = "Iplot111222333222111111222333222111!!";

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:mat="http://matrikkel.statkart.no/matrikkelapi/wsapi/v1/service/matrikkelenhet"
    xmlns:mat1="http://matrikkel.statkart.no/matrikkelapi/wsapi/v1/domain/matrikkelenhet"
    xmlns:dom="http://matrikkel.statkart.no/matrikkelapi/wsapi/v1/domain">
   <soapenv:Header/>
   <soapenv:Body>
      <mat:findMatrikkelenheter>
         <mat:matrikkelenhetsokModel>
            <mat1:kommunenummer>3203</mat1:kommunenummer>
            <mat1:gardsnummer>243</mat1:gardsnummer>
            <mat1:bruksnummer>594</mat1:bruksnummer>
         </mat:matrikkelenhetsokModel>
         <mat:matrikkelContext>
            <dom:locale>no_NO_B</dom:locale>
            <dom:brukOriginaleKoordinater>false</dom:brukOriginaleKoordinater>
            <dom:koordinatsystemKodeId>
               <dom:value>84</dom:value>
            </dom:koordinatsystemKodeId>
            <dom:systemVersion>3.17.0</dom:systemVersion>
            <dom:klientIdentifikasjon>minKlient</dom:klientIdentifikasjon>
            <dom:snapshotVersion>
               <dom:timestamp>9999-01-01T00:00:00+01:00</dom:timestamp>
            </dom:snapshotVersion>
         </mat:matrikkelContext>
      </mat:findMatrikkelenheter>
   </soapenv:Body>
</soapenv:Envelope>`;

    const base64encodedData = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml",
          Authorization: `Basic ${base64encodedData}`,
        },
        body: body,
      });

      if (response.ok) {
        await response.text();
      } else {
        console.error(`HTTP error! Status: ${response.status}`);
        const errorText = await response.text();
        console.error("Error details:", errorText);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  },
  askApi: async function (data: any) {
    try {
      const response = await fetch(`https://iplotnor-iplot.hf.space/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const jsonData = await response.json();

      return jsonData;
    } catch (error: any) {
      console.error("Error in askApi:", error?.message);
      throw error;
    }
  },
  LamdaApi: async function (data: any) {
    const url =
      "https://8nw82oaaej.execute-api.eu-north-1.amazonaws.com/dev/property";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      return await res.json();
    } catch (err: any) {
      console.error("Error in getData:", err);
    }
  },
  fetchCadastreData: async function (data: any) {
    const url = `https://2nbi2lu6ki.execute-api.eu-north-1.amazonaws.com/default/cadastre/${data.kommunenummer}-${data.gardsnummer}-${data.bruksnummer}-0-0`;

    try {
      const headers = {
        "Content-Type": "application/json",
        Cookie:
          "PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7IkF1dGhvcml6YXRpb24iOiJCZWFyZXIgOTIxYmE3ODgtZTA1Ny00Y2YxLWI1ZjAtNmY5YTE5MTkyYWJmIn0sIm5iZiI6MTczNzA5MzczNiwiaWF0IjoxNzM3MDkzNzM2fQ.OwLpiBh_Jr2OZ3HrKYjF_Y1_OwdTal2ENZ1yjenuJM8",
      };
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
};

export default ApiUtils;
