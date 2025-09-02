"use client";
import React, { useEffect, useState } from "react";
import TomtHusmodell from "./TomtHusmodell";
import { useRouter } from "next/router";
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
import Stepper from "@/components/Ui/stepper";
import Tilpass from "./Tilpass";
import Tilbud from "./Tilbud";
import Finansiering from "./Finansiering";
import Verdivurdering from "./Verdivurdering";
import NotFound from "../page-not-found";

const HusmodellPlot = () => {
  const [currIndex, setCurrIndex] = useState<number | null>(null);

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

  const [lamdaDataFromApi, setLamdaDataFromApi] = useState<any | null>(null);
  const [CadastreDataFromApi, setCadastreDataFromApi] = useState<any | null>(
    null
  );
  const [HouseModelData, setHouseModelData] = useState<any>(null);

  const router = useRouter();
  const { propertyId, emptyPlot, husmodellId } = router.query;
  const [loading, setLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [additionalData, setAdditionalData] = useState<any | undefined>(null);
  const [userUID, setUserUID] = useState(null);
  const [pris, setPris] = useState(0);
  const [isCall, setIsCall] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

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
          setUserUID(user.uid);
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
    const fetchProperty = async () => {
      const husmodellDocRef = doc(db, "house_model", String(husmodellId));
      const husmodellDocSnap = await getDoc(husmodellDocRef);

      if (husmodellDocSnap.exists()) {
        setHouseModelData(husmodellDocSnap.data());
      } else {
        console.error("No document found for plot or husmodell ID.");
      }

      let propertiesCollectionRef: any;
      if (emptyPlot) {
        propertiesCollectionRef = doc(db, "empty_plot", String(propertyId));
      } else {
        propertiesCollectionRef = collection(
          db,
          "users",
          String(userUID),
          "property"
        );
      }
      try {
        let foundProperty: any;
        if (emptyPlot) {
          const plotDocSnap: any = await getDoc(propertiesCollectionRef);
          if (plotDocSnap.exists()) {
            const fetchedProperties = {
              propertyId: plotDocSnap.id,
              ...plotDocSnap.data(),
            };
            foundProperty = fetchedProperties;
          } else {
            console.error("No property found in empty_plot with the given ID.");
            return;
          }
        } else {
          const propertiesSnapshot = await getDocs(propertiesCollectionRef);
          const fetchedProperties = propertiesSnapshot.docs.map((doc: any) => ({
            propertyId: doc.id,
            ...doc.data(),
          }));
          foundProperty = fetchedProperties.find(
            (property: any) => property.propertyId === propertyId
          );
        }

        const property = {
          lamdaDataFromApi: foundProperty?.lamdaDataFromApi,
          additionalData: foundProperty?.additionalData,
          CadastreDataFromApi: foundProperty?.CadastreDataFromApi,
          pris: null,
        };
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.delete("empty");

        const isEmptyPlot =
          !foundProperty?.CadastreDataFromApi?.apis?.buildingsApi?.response
            ?.items?.length;
        const collectionName = isEmptyPlot ? "empty_plot" : "plot_building";
        queryParams.set("empty", isEmptyPlot ? "true" : "false");

        const collectionRef = collection(db, collectionName);
        const existingQuery = query(
          collectionRef,
          where("lamdaDataFromApi.propertyId", "==", propertyId)
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

        if (foundProperty) {
          setAdditionalData(foundProperty?.additionalData);
          setLamdaDataFromApi(foundProperty?.lamdaDataFromApi);
          setCadastreDataFromApi(foundProperty?.CadastreDataFromApi);
          setPris(foundProperty?.pris | 0);
        } else {
          console.error("No property found with the given ID.");
        }
      } catch (error: any) {
        console.error("Error fetching user's properties:", error);
        setShowErrorPopup(true);
        setErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };
    if (propertyId && userUID && husmodellId && isCall && user) {
      setLoading(true);

      if (user) {
        fetchProperty();
      }
    }
  }, [propertyId, userUID, db, user, husmodellId, isCall]);

  const handleNext = () => {
    if (typeof currIndex === "number" && currIndex < steps.length - 1) {
      setCurrIndex(currIndex + 1);
    }
    if (leadId) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, leadId: leadId },
      });
    }
  };
  const handlePrevious = () => {
    if (typeof currIndex === "number" && currIndex > 0) {
      setCurrIndex(currIndex - 1);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currIndex]);

  const [askData, setAskData] = useState<any | null>(null);

  useEffect(() => {
    if (additionalData?.answer) {
      try {
        const cleanAnswer = additionalData.answer;

        setAskData(cleanAnswer);
      } catch (error) {
        console.error("Error parsing additionalData.answer:", error);
        setAskData(null);
      }
    }
  }, [additionalData]);

  const [leadId, setLeadId] = useState<any | null>(null);

  useEffect(() => {
    if (leadId) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, leadId: leadId },
      });
    }
  }, [leadId]);
  const [date, setDate] = useState(new Date());
  const [stored, setStored] = useState<any>();

  useEffect(() => {
    const store = localStorage.getItem("customizeHouse");
    setStored(store);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !propertyId || !husmodellId) {
        return;
      }

      setLoading(true);
      const queryParams = new URLSearchParams(window.location.search);
      const isEmptyPlot = queryParams.get("empty");
      queryParams.delete("leadId");
      queryParams.delete("crmLead");

      try {
        let plotCollectionRef = collection(db, "empty_plot");
        const plotDocRef = doc(plotCollectionRef, String(propertyId));
        const plotDocSnap = await getDoc(plotDocRef);

        const husmodellDocRef = doc(db, "house_model", String(husmodellId));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        const finalData = {
          plot: { id: propertyId, ...plotDocSnap.data() },
          husmodell: { id: husmodellId, ...husmodellDocSnap.data() },
        };

        const leadsSupplierQuery: any = await getDocs(
          query(
            collection(db, "leads_from_supplier"),
            where("plotId", "==", String(propertyId)),
            where("husmodellId", "==", husmodellId),
            where("created_by", "==", user.id)
          )
        );
        if (!leadsSupplierQuery.empty) {
          const existingLeadId = leadsSupplierQuery.docs[0].id;
          if (existingLeadId) {
            queryParams.set("crmLead", existingLeadId);
            router.replace({
              pathname: router.pathname,
              query: Object.fromEntries(queryParams),
            });
          }
        }

        const leadsCollectionRef = collection(db, "leads");
        const querySnapshot: any = await getDocs(
          query(
            leadsCollectionRef,
            where("finalData.plot.id", "==", propertyId),
            where("finalData.husmodell.id", "==", husmodellId)
          )
        );

        if (!querySnapshot.empty) {
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, leadId: querySnapshot.docs[0].id },
          });
          setLeadId(querySnapshot.docs[0].id);
          const data = querySnapshot.docs[0].data();
          if (data.Isopt === true || data.IsoptForBank === true) {
            const timestamp = data.updatedAt;

            const finalDate = new Date(
              timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000
            );
            setDate(finalDate);
          }

          return;
        }

        const docRef: any = await addDoc(leadsCollectionRef, {
          finalData,
          user,
          Isopt: false,
          IsoptForBank: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          IsEmptyPlot: isEmptyPlot === "true",
          stored,
        });
        setDate(new Date());

        router.replace({
          pathname: router.pathname,
          query: { ...router.query, leadId: docRef.id },
        });
        setLeadId(docRef.id);
      } catch (error) {
        console.error("Firestore operation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId && husmodellId) {
      fetchData();
    }
  }, [propertyId, husmodellId, user]);
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

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
        const response = await fetch(
          "https://d8t0z35n2l.execute-api.eu-north-1.amazonaws.com/prod/bya",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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

        if (json?.bya_percentage) {
          setResultLoading(false);
        }

        if (json && json?.plan_link) {
          const [res, resPlan] = await Promise.all([
            fetch("https://iplotnor-areaplanner.hf.space/resolve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                step1_url: json?.plan_link,
                api_token: "D7D7FFB4-1A4A-44EA-BD15-BCDB6CEF8CA5",
              }),
            }),
            fetch("https://iplotnor-areaplanner.hf.space/other-documents", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                step1_url: json?.plan_link,
                api_token: "D7D7FFB4-1A4A-44EA-BD15-BCDB6CEF8CA5",
              }),
            }),
          ]);

          if (!res.ok || !resPlan.ok) {
            throw new Error("Request failed");
          }

          const [data, dataPlan] = await Promise.all([
            res.json(),
            resPlan.json(),
          ]);

          setPlanDocuments(dataPlan?.planning_treatments);
          setExemptions(dataPlan?.exemptions);
          setDocuments(data);
          if (dataPlan) {
            setDocumentLoading(false);
          }

          if (data?.inputs?.internal_plan_id) {
            const uniqueId = String(data?.inputs?.internal_plan_id);

            if (!uniqueId) {
              console.warn("No uniqueId found, skipping Firestore setDoc");
              return;
            }

            const plansDocRef = doc(db, "mintomt_plans", uniqueId);

            const existingDoc = await getDoc(plansDocRef);

            if (existingDoc.exists()) {
              setResult(existingDoc?.data()?.rule);
              return;
            }
          }
          if (data && data?.rule_book) {
            const responseData = await fetch(
              "https://iplotnor-norwaypropertyagent.hf.space/extract_json",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  pdf_url: data?.rule_book?.link,
                  plot_size_m2: `${
                    lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                      ?.areal_beregnet ?? 0
                  }`,
                }),
              }
            );

            // const pdfResponse = await fetch(data?.rule_book?.link);
            // const pdfBlob = await pdfResponse.blob();

            // const formData = new FormData();
            // formData.append("file", pdfBlob, "rule_book.pdf");

            // const responseData = await fetch(
            //   "https://iplotnor-norwaypropertyagent.hf.space/extract_file",
            //   {
            //     method: "POST",
            //     body: formData,
            //   }
            // );

            if (!responseData.ok) {
              throw new Error("Network response was not ok");
            }

            const responseResult = await responseData.json();
            setResult(responseResult?.data);

            if (responseResult?.data) {
              const uniqueId = String(data?.inputs?.internal_plan_id);

              if (!uniqueId) {
                console.warn("No uniqueId found, skipping Firestore setDoc");
                return;
              }

              const plansDocRef = doc(db, "mintomt_plans", uniqueId);

              const formatDate = (date: Date) =>
                date
                  .toLocaleString("sv-SE", { timeZone: "UTC" })
                  .replace(",", "");

              const existingDoc = await getDoc(plansDocRef);

              if (!existingDoc.exists()) {
                await setDoc(plansDocRef, {
                  id: uniqueId,
                  updatedAt: formatDate(new Date()),
                  createdAt: formatDate(new Date()),
                  documents: { ...data },
                  rule: { ...responseResult?.data },
                });
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setResultLoading(false);
      }
    };

    if (CadastreDataFromApi) {
      fetchPlotData();
    }
  }, [CadastreDataFromApi]);

  const steps = [
    {
      name: "Tomt & husmodell",
      component: (
        <TomtHusmodell
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loadingAdditionalData={loading}
          loginUser={loginUser}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          setIsCall={setIsCall}
          loadingLamdaData={loading}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          propertyId={propertyId}
          HouseModelData={HouseModelData}
          supplierData={supplierData}
          pris={pris}
          setAdditionalData={setAdditionalData}
          setLamdaDataFromApi={setLamdaDataFromApi}
          setCadastreDataFromApi={setCadastreDataFromApi}
          results={results}
          BoxData={BoxData}
          resultsLoading={resultsLoading}
          Documents={Documents}
          PlanDocuments={PlanDocuments}
          exemptions={exemptions}
          documentLoading={documentLoading}
        />
      ),
    },
    {
      name: "Tilpass",
      component: (
        <Tilpass
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loadingLamdaData={loading}
          HouseModelData={HouseModelData}
          handlePrevious={handlePrevious}
          supplierData={supplierData}
          pris={pris}
          CadastreDataFromApi={CadastreDataFromApi}
        />
      ),
    },
    {
      name: "Tilbud",
      component: (
        <Tilbud
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loadingLamdaData={loading}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          HouseModelData={HouseModelData}
          supplierData={supplierData}
          handlePrevious={handlePrevious}
          pris={pris}
          date={date}
          setDate={setDate}
          results={results}
          BoxData={BoxData}
          resultsLoading={resultsLoading}
        />
      ),
    },
    {
      name: "Finansiering",
      component: (
        <Finansiering
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loadingLamdaData={loading}
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
        />
      )}
    </>
  );
};

export default HusmodellPlot;
