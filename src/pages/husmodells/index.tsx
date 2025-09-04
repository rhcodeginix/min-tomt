"use client";
import React, { useEffect, useState } from "react";
import Stepper from "@/components/Ui/stepper";
import Husmodell from "./Husmodell";
import { useRouter } from "next/router";
import Tomt from "./Tomt";
import Tilbud from "./Tilbud";
import Finansiering from "./Finansiering";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import Tilpass from "./Tilpass";
import ApiUtils from "@/api";
import Verdivurdering from "./Verdivurdering";
import NotFound from "../page-not-found";

export function convertCurrencyFormat(input: any) {
  const numberPart = String(input).replace(/\s+/g, "").replace(/kr/i, "");

  const parsed = parseInt(numberPart, 10);
  if (isNaN(parsed)) return input;

  const formatted = parsed.toLocaleString("no-NO", {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: 0,
  });

  return `kr ${formatted}`;
}

const HusmodellDetail = () => {
  const [currIndex, setCurrIndex] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem("currIndex");
      if (savedIndex) {
        setCurrIndex(Number(savedIndex));
      } else {
        setCurrIndex(0);
      }
    }
  }, [currIndex]);
  const router = useRouter();
  const {
    plotId,
    husmodellId,
    kommunenummer,
    gardsnummer,
    bruksnummer,
    kommunenavn,
  } = router.query;
  const [lamdaDataFromApi, setLamdaDataFromApi] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [additionalData, setAdditionalData] = useState<any | undefined>(null);
  const [CadastreDataFromApi, setCadastreDataFromApi] = useState<any | null>(
    null
  );
  const [askData, setAskData] = useState<any | null>(null);
  const [userUID, setUserUID] = useState(null);
  const [isCall, setIsCall] = useState(false);
  const [pris, setPris] = useState(0);
  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [HouseModelData, setHouseModelData] = useState<any>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    if (isLoggedIn) {
      setLoginUser(true);
      setIsCall(true);
    }
  }, []);
  useEffect(() => {
    if (!loginUser) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  }, [loginUser]);

  useEffect(() => {
    if (additionalData?.answer) {
      try {
        const cleanAnswer = additionalData?.answer;

        setAskData(cleanAnswer);
      } catch (error) {
        console.error("Error parsing additionalData.answer:", error);
        setAskData(null);
      }
    }
  }, [additionalData]);

  const handleNext = () => {
    if (currIndex < steps.length - 1) {
      setCurrIndex(currIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currIndex > 0) {
      setCurrIndex(currIndex - 1);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currIndex]);
  useEffect(() => {
    if (
      HouseModelData?.Husdetaljer?.Leverandører !==
        "9f523136-72ca-4bde-88e5-de175bc2fc71" &&
      currIndex < 2
    ) {
      const { plotId, ...restQuery } = router.query;

      if (plotId) {
        router.replace(
          {
            pathname: router.pathname,
            query: restQuery,
          },
          undefined,
          { shallow: true }
        );
      }
      setPris(0);
    }
  }, [currIndex, router]);
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
  //     if (user) {
  //       try {
  //         const userDocRef = doc(db, "users", user.uid);
  //         const userDocSnapshot = await getDoc(userDocRef);

  //         if (userDocSnapshot.exists()) {
  //           const userData = userDocSnapshot.data();
  //           setUser({
  //             id: userDocSnapshot.id,
  //             ...userData,
  //           });
  //           setUserUID(user.uid);
  //         } else {
  //           console.error("No such document in Firestore!");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       }
  //     } else {
  //       setUser(null);
  //       setUserUID(null);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [isCall]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot: any = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          setUser({
            id: userDocSnapshot.uid,
            ...userData,
          });
          setUserUID(userDocSnapshot.uid);
        }
      } else {
        const isVippsLogin = localStorage.getItem("min_tomt_login");
        const userEmail = localStorage.getItem("I_plot_email");

        if (isVippsLogin && userEmail) {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", userEmail));
          const snapshot: any = await getDocs(q);

          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            setUser({
              id: userData.uid,
              ...userData,
            });
            setUserUID(userData.uid);
          }
        } else {
          setUser(null);
          setUserUID(null);
        }
      }
    });

    return () => unsubscribe();
  }, [isCall]);

  useEffect(() => {
    if (plotId && userUID && !kommunenummer) {
      setLoading(true);

      const fetchProperty = async () => {
        const plotDocRef = doc(db, "empty_plot", String(plotId));

        try {
          const plotDocSnap = await getDoc(plotDocRef);
          if (plotDocSnap.exists()) {
            const fetchedProperties: any = {
              propertyId: plotDocSnap.id,
              ...plotDocSnap.data(),
            };

            if (fetchedProperties) {
              setAdditionalData(fetchedProperties?.additionalData);
              setLamdaDataFromApi(fetchedProperties?.lamdaDataFromApi);
              setCadastreDataFromApi(fetchedProperties?.CadastreDataFromApi);
              setPris(fetchedProperties?.pris | 0);
            } else {
              console.error("No property found with the given ID.");
            }
          }
        } catch (error: any) {
          console.error("Error fetching user's properties:", error);
          setErrorMessage(error);
          setShowErrorPopup(true);
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [plotId, db, userUID, isCall, user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!(kommunenummer && gardsnummer && bruksnummer)) return;

      const lamdaApiData = { kommunenummer, gardsnummer, bruksnummer };

      try {
        const response = await ApiUtils.LamdaApi(lamdaApiData);
        const cleanAnswer = response.body.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanAnswer);
        const CadastreDataResponse =
          await ApiUtils.fetchCadastreData(lamdaApiData);
        setLamdaDataFromApi(data);
        if (
          !cleanAnswer ||
          data.message === "Request failed with status code 503" ||
          !data.propertyId
        ) {
          setLoading(false);
          setErrorMessage(data.message);
          setShowErrorPopup(true);
          return;
        }
        if (CadastreDataResponse && CadastreDataResponse?.apis) {
          setCadastreDataFromApi(CadastreDataResponse?.apis);
        }
        const areaDetails =
          data?.eiendomsInformasjon?.basisInformasjon?.areal_beregnet || "";
        const regionName =
          CadastreDataResponse?.presentationAddressApi?.response?.item
            ?.municipality?.municipalityName;
        const prompt = {
          question: `Hva er tillatt gesims- og mønehøyde, maksimal BYA inkludert parkeringskrav i henhold til parkeringsnormen i ${kommunenavn || regionName} kommune, og er det tillatt å bygge en enebolig med flatt tak eller takterrasse i dette området i ${kommunenavn || regionName}, sone GB? Tomtestørrelse for denne eiendommen er ${areaDetails}.`,
        };

        try {
          const additionalResponse = await ApiUtils.askApi(prompt);

          const property = {
            lamdaDataFromApi: data,
            additionalData: additionalResponse,
            CadastreDataFromApi: CadastreDataResponse.apis,
            pris: null,
          };
          const propertyId = data.propertyId;
          const queryParams = new URLSearchParams(window.location.search);
          queryParams.set("plotId", propertyId);
          queryParams.delete("empty");

          const isEmptyPlot =
            !CadastreDataResponse?.apis?.buildingsApi?.response?.items?.length;
          const collectionName = isEmptyPlot ? "empty_plot" : "plot_building";
          queryParams.set("empty", isEmptyPlot ? "true" : "false");

          const collectionRef = collection(db, collectionName);
          const existingQuery = query(
            collectionRef,
            isEmptyPlot
              ? where("id", "==", propertyId)
              : where("lamdaDataFromApi.propertyId", "==", propertyId)
          );
          const querySnapshot = await getDocs(existingQuery);

          let docId, plotData;
          if (!querySnapshot.empty) {
            const docSnap: any = querySnapshot.docs[0];
            docId = docSnap.id;
            plotData = docSnap.data();
          } else {
            const docRef = await addDoc(collectionRef, property);
            docId = docRef.id;
            plotData =
              (await getDoc(doc(db, collectionName, docId))).data() || null;
          }

          const updatedPlotData = {
            ...plotData,
            view_count: (plotData?.view_count || 0) + 1,
          };
          await setDoc(doc(db, collectionName, docId), updatedPlotData, {
            merge: true,
          });

          const viewerDocRef = doc(
            db,
            `${collectionName}/${docId}/viewer`,
            user.uid
          );
          const viewerDocSnap = await getDoc(viewerDocRef);
          let viewerViewCount = 1;

          if (viewerDocSnap.exists()) {
            const viewerData = viewerDocSnap.data();
            viewerViewCount = (viewerData?.view_count || 0) + 1;
          }

          await setDoc(
            viewerDocRef,
            {
              userId: user.uid,
              name: user.name || "N/A",
              last_updated_date: new Date().toISOString(),
              view_count: viewerViewCount,
            },
            { merge: true }
          );

          router.replace({
            pathname: router.pathname,
            query: Object.fromEntries(queryParams),
          });

          setAdditionalData(additionalResponse);
        } catch (error: any) {
          console.error("Error fetching additional data from askApi:", error);
          setErrorMessage(error);
          setShowErrorPopup(true);
        } finally {
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setErrorMessage(error);
        setShowErrorPopup(true);
      }
    };

    if (isCall && user && kommunenummer && gardsnummer && bruksnummer) {
      fetchData();
    }
  }, [kommunenummer, gardsnummer, bruksnummer, isCall, user, userUID]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const husmodellDocRef = doc(db, "house_model", String(husmodellId));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (husmodellDocSnap.exists()) {
          setHouseModelData(husmodellDocSnap.data());
        } else {
          console.error("No document found for plot or husmodell ID.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (husmodellId) {
      fetchData();
    }
  }, [husmodellId, isCall, user]);
  const husmodellData = HouseModelData?.Husdetaljer;
  const [supplierData, setSupplierData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const supplierDocRef = doc(
          db,
          "suppliers",
          husmodellData?.Leverandører
        );
        const docSnap: any = await getDoc(supplierDocRef);

        if (docSnap.exists()) {
          setSupplierData(docSnap.data());
        } else {
          console.error(
            "No document found for ID:",
            husmodellData?.Leverandører
          );
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };
    if (husmodellData?.Leverandører) {
      getData();
    }
  }, [husmodellData?.Leverandører]);

  const BBOXData =
    CadastreDataFromApi?.cadastreApi?.response?.item?.geojson?.bbox;

  const [BoxData, setBoxData] = useState<any>(null);
  const [results, setResult] = useState<any>(null);
  const [resultsLoading, setResultLoading] = useState(true);
  const [Documents, setDocuments] = useState<any>(null);
  const [PlanDocuments, setPlanDocuments] = useState<any>(null);
  const [exemptions, setExemptions] = useState<any>(null);
  const [documentLoading, setDocumentLoading] = useState(true);
  const [KommunePlan, setKommunePlan] = useState<any>(null);
  const [KommuneLoading, setKommuneLoading] = useState(true);

  useEffect(() => {
    const fetchPlotData = async () => {
      if (!CadastreDataFromApi) return;

      try {
        const response = await fetch(
          "https://d8t0z35n2l.execute-api.eu-north-1.amazonaws.com/prod/bya",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: `https://wms.geonorge.no/skwms1/wms.reguleringsplaner?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&QUERY_LAYERS=Planomrade_02,Arealformal_02&LAYERS=Planomrade_02,Arealformal_02&INFO_FORMAT=text/html&CRS=EPSG:25833&BBOX=${BBOXData[0]},${BBOXData[1]},${BBOXData[2]},${BBOXData[3]}&WIDTH=800&HEIGHT=600&I=400&J=300`,
              plot_size_m2:
                lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                  ?.areal_beregnet ?? 0,
            }),
          }
        );

        const json = await response.json();
        setBoxData(json);

        if (!json?.plan_link) {
          setResultLoading(false);
          return;
        }

        const resolveApiCall = {
          name: "resolve",
          url: "https://iplotnor-areaplanner.hf.space/resolve",
          body: {
            step1_url: json.plan_link,
            api_token: `${process.env.NEXT_PUBLIC_DOCUMENT_TOKEN}`,
          },
        };

        const resolveResult = await makeApiCall(resolveApiCall);
        if (!resolveResult.success) {
          setResultLoading(false);
          return;
        }
        setDocuments(resolveResult.data);

        const internalPlanId = resolveResult.data?.inputs?.internal_plan_id;
        if (!internalPlanId) {
          setResultLoading(false);
          return;
        }

        const plansDocRef = doc(db, "mintomt_plans", String(internalPlanId));
        const existingDoc = await getDoc(plansDocRef);

        if (existingDoc.exists()) {
          const data = existingDoc.data();
          setDocuments(data.resolve ?? {});
          setKommunePlan(data.kommuneplanens ?? {});
          setPlanDocuments(data["other-documents"]?.planning_treatments ?? []);
          setExemptions(data["other-documents"]?.exemptions ?? []);
          setResult(data.rule ?? {});
          setResultLoading(false);
          setKommuneLoading(false);
          return;
        }
        if (
          resolveResult.data?.rule_book &&
          resolveResult.data?.rule_book?.link
        ) {
          const extractResult = await makeApiCall({
            name: "extract_json_direct_gpt",
            url: "https://iplotnor-norwaypropertyagent.hf.space/extract_json_direct_gpt",
            body: {
              pdf_url: resolveResult.data?.rule_book?.link,
              plot_size_m2:
                lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                  ?.areal_beregnet ?? 0,
            },
          });

          if (!extractResult.success) {
            throw new Error("PDF extraction failed");
          }

          setResult(extractResult.data?.data);

          const apiCalls = [
            {
              name: "kommuneplanens",
              url: "https://iplotnor-areaplanner.hf.space/kommuneplanens",
              body: {
                coordinates_url: json.plan_link,
                knr: `${lamdaDataFromApi?.searchParameters?.kommunenummer}`,
                gnr: `${lamdaDataFromApi?.searchParameters?.gardsnummer}`,
                bnr: `${lamdaDataFromApi?.searchParameters?.bruksnummer}`,
                api_token: `${process.env.NEXT_PUBLIC_DOCUMENT_TOKEN}`,
                debug_mode: true,
              },
            },
            {
              name: "other-documents",
              url: "https://iplotnor-areaplanner.hf.space/other-documents",
              body: {
                step1_url: json.plan_link,
                api_token: `${process.env.NEXT_PUBLIC_DOCUMENT_TOKEN}`,
              },
            },
          ];

          const otherResults = await Promise.all(
            apiCalls.map((c) => makeApiCall(c))
          );

          const firebaseData: any = {
            resolve: resolveResult.data,
          };
          otherResults.forEach((r) => {
            if (r.success) firebaseData[r.name] = r.data;
          });

          otherResults.forEach((r) => {
            if (r.success) {
              if (r.name === "kommuneplanens") {
                setKommunePlan(r.data);
                setKommuneLoading(false);
              }
              if (r.name === "other-documents") {
                setPlanDocuments(r.data?.planning_treatments ?? []);
                setExemptions(r.data?.exemptions ?? []);
              }
            }
          });

          const kommunePlanId =
            firebaseData?.kommuneplanens?.kommuneplan_info?.id;
          const kommunePlansDocRef = doc(
            db,
            "kommune_plans",
            String(kommunePlanId)
          );
          const existingKommuneDoc = await getDoc(kommunePlansDocRef);

          const uniquekommuneId = String(kommunePlanId);

          if (!existingKommuneDoc.exists()) {
            await setDoc(kommunePlansDocRef, {
              id: uniquekommuneId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              data: firebaseData?.kommuneplanens,
            });
          }

          const uniqueId = String(internalPlanId);

          if (!existingDoc.exists()) {
            await setDoc(plansDocRef, {
              id: uniqueId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              documents: { ...resolveResult.data },
              rule: { ...extractResult.data?.data },
              ...firebaseData,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching plot data:", error);
      } finally {
        setResultLoading(false);
      }
    };

    fetchPlotData();
  }, [CadastreDataFromApi]);

  const makeApiCall = async (apiCall: any, timeout = 500000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(apiCall.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiCall.body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `${apiCall.name} request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      switch (apiCall.name) {
        case "kommuneplanens":
          setKommunePlan(data);
          setKommuneLoading(false);
          break;

        case "other-documents":
          setPlanDocuments(data?.planning_treatments);
          setExemptions(data?.exemptions);
          break;
      }

      return {
        name: apiCall.name,
        success: true,
        data: data,
        error: null,
      };
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.error(`${apiCall.name} API timed out after ${timeout}ms`);
      } else {
        console.error(`${apiCall.name} API failed:`, error);
      }
      return {
        name: apiCall.name,
        success: false,
        data: null,
        error: error.message || error,
      };
    }
  };

  useEffect(() => {
    if (PlanDocuments) {
      setDocumentLoading(false);
    }
  }, [PlanDocuments]);

  const steps = [
    {
      name: "Husmodell",
      component: (
        <Husmodell
          handleNext={handleNext}
          loading={loading}
          loginUser={loginUser}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          setIsCall={setIsCall}
          HouseModelData={HouseModelData}
          pris={pris}
          lamdaDataFromApi={lamdaDataFromApi}
          supplierData={supplierData}
          user={user}
          setHouseModelData={setHouseModelData}
        />
      ),
    },
    ...(husmodellData?.Leverandører !== "9f523136-72ca-4bde-88e5-de175bc2fc71"
      ? [
          {
            name: "Tilpass",
            component: (
              <Tilpass
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                loading={loading}
                HouseModelData={HouseModelData}
                lamdaDataFromApi={lamdaDataFromApi}
                supplierData={supplierData}
                pris={pris}
                user={user}
              />
            ),
          },
        ]
      : []),
    {
      name: "Tomt",
      component: (
        <Tomt
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          HouseModelData={HouseModelData}
          setLamdaDataFromApi={setLamdaDataFromApi}
          setCadastreDataFromApi={setCadastreDataFromApi}
          setAdditionalData={setAdditionalData}
          loadingAdditionalData={loading}
          loginUser={loginUser}
          loadingLamdaData={loading}
          supplierData={supplierData}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          lamdaDataFromApi={lamdaDataFromApi}
          user={user}
          results={results}
          BoxData={BoxData}
          resultsLoading={resultsLoading}
          Documents={Documents}
          PlanDocuments={PlanDocuments}
          exemptions={exemptions}
          documentLoading={documentLoading}
          KommunePlan={KommunePlan}
          KommuneLoading={KommuneLoading}
        />
      ),
    },
    ...(husmodellData?.Leverandører !== "9f523136-72ca-4bde-88e5-de175bc2fc71"
      ? [
          {
            name: "Tilbud",
            component: (
              <Tilbud
                handleNext={handleNext}
                lamdaDataFromApi={lamdaDataFromApi}
                CadastreDataFromApi={CadastreDataFromApi}
                askData={askData}
                HouseModelData={HouseModelData}
                supplierData={supplierData}
                handlePrevious={handlePrevious}
                pris={pris}
                user={user}
                results={results}
                BoxData={BoxData}
                resultsLoading={resultsLoading}
              />
            ),
          },
        ]
      : []),
    {
      name: "Finansiering",
      component: (
        <Finansiering
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loading={loading}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          HouseModelData={HouseModelData}
          handlePrevious={handlePrevious}
          pris={pris}
          supplierData={supplierData}
          results={results}
          BoxData={BoxData}
          resultsLoading={resultsLoading}
        />
      ),
    },
    {
      name: "Verdivurdering",
      component: (
        <Verdivurdering
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loading={loading}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          HouseModelData={HouseModelData}
          handlePrevious={handlePrevious}
          pris={pris}
          supplierData={supplierData}
          results={results}
          BoxData={BoxData}
          resultsLoading={resultsLoading}
        />
      ),
    },
  ];
  return (
    <>
      {showErrorPopup ? (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-screen w-full bg-white overflow-hidden"
          style={{ zIndex: 999 }}
        >
          <NotFound error={errorMessage} />
        </div>
      ) : (
        <Stepper
          steps={steps}
          currIndex={currIndex}
          setCurrIndex={setCurrIndex}
          // Style={
          //   husmodellData?.Leverandører !==
          //   "9f523136-72ca-4bde-88e5-de175bc2fc71"
          //     ? "true"
          //     : undefined
          // }
          Style={
            husmodellData?.Leverandører !==
            "9f523136-72ca-4bde-88e5-de175bc2fc71"
          }
          total={
            husmodellData?.Leverandører ===
            "9f523136-72ca-4bde-88e5-de175bc2fc71"
          }
        />
      )}
    </>
  );
};

export default HusmodellDetail;
