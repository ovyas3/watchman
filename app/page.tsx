"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import factory from "../assets/factory_illustration.svg";
import factoryIcon from "../assets/factory_icon.svg";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSnackbar, SnackbarComponent } from "./hooks/snackBar";
import { toast, ToastContainer } from "react-toastify";
import { signOut } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showSnackbar, snackbarState } = useSnackbar();
  const [parent, setParent] = useState<any>("");
  const [unit, setUnit] = useState<any>("");
  const [validVehicle, setValidVehicle] = useState(false);
  const [vehicleNo, setVehicleNo] = useState("");
  const PATTERN = /^[A-Za-z0-9\s]*$/;

  if(session){
    localStorage.setItem('accessToken',session.user.data.accessToken);
    localStorage.setItem('default_unit',session.user.data.default_unit);
  }

  const handleClick = async () => {
    if (!vehicleNo) {
      toast.error("Please enter a valid vehicle number", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "error",
      });
    } else {
      const response = await fetch(
        "https://prod-api.instavans.com/api/thor/security/get_valid_vehicle?" +
          new URLSearchParams({ vehicle_no: vehicleNo }),
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.statusCode == 500) {
        toast.error("Vehicle not found", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
        setValidVehicle(false);
      }
      if (data.statusCode == 400) {
        toast.error("Invalid vehicle number", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
        setValidVehicle(false);
      }
      if (data.statusCode == 401) {
        toast.error("Unauthorized", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
        setValidVehicle(false);
      }
      if (data.statusCode == 403) {
        toast.error("Forbidden", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
        setValidVehicle(false);
      }
      if (data.statusCode == 404) {
        toast.error("Vehicle not found", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
        setValidVehicle(false);
      }
      if (data.statusCode == 200) {
        setValidVehicle(true);
        router.push(`/securityForm?vehicleNo=${vehicleNo}`);
      }
    }
  };

  const handleOnChange = (event: any) => {
    const inputValue = event.target.value;

    if (!PATTERN.test(inputValue)) {
      toast.error("Only letters and numbers are allowed", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "error",
      });
      return;
    }
    const vehicle = inputValue.toUpperCase();
    setVehicleNo(vehicle);
    if (!vehicle) setValidVehicle(false);
    else setValidVehicle(true);
  };

  useEffect(() => {
    let units: { parent_name: string; name: string }[] | undefined =
      session?.user?.data.shippers.filter(
        (s: any) => s._id === session.user.data.default_unit
      );
    if (units && units.length > 0) {
      setParent(units[0].parent_name);
      setUnit(units[0].name);
    }
  });

  const handleLogout = async () => {
    await fetch(
      "https://prod-api.instavans.com/api/thor/shipper_user/sign_out?from=web",
      {
        method: "PUT",
        headers: {
          Authorization: `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
          "Content-Type": "application/json",
        },
      }
    );
    await signOut({ redirect: true, callbackUrl: "/" });

    window.localStorage.removeItem("nextauth.session-token");
  };

  return (
    <>
      <ToastContainer />

      <div className="md:flex md:flex-row-reverse justify-between gap-[80px] p-[20px] h-screen w-screen bg-[#fcfcfc]">
        <SnackbarComponent {...snackbarState} />
        <div className="bodyRight flex items-center justify-center flex-[0.6] bg-[#F0F3F9]">
          <Image
            src={factory}
            alt=""
          />
        </div>
        <div className="bodyLeft flex flex-col gap-[80px] flex-[0.4]">
          <div className="bottom md:mt-[64px] flex flex-col items-left justify-center w-full gap-[56px]">
            <div className="vehicleDetails flex flex-col gap-[64px]">
              <div
                className="flex items-center justify-end w-full"
                onClick={handleLogout}
              >
                <div
                  className="logout text-[#fafafa] text-[12px] w-[84px] h-[36px]
         flex items-center justify-center bg-[#E24D65] rounded
         cursor-pointer hover:bg-[#E45E74]
         transition duration-150 ease-out hover:ease-in
         "
                >
                  Log out
                </div>
              </div>
              <div className="label text-[#131722] text-[32px] font-bold">
                Vehicle security check
              </div>
              <div className="inputContainer flex flex-col gap-[24px]">
                <div className="containerTop flex gap-2">
                  <div className="right">
                    <Image src={factoryIcon} alt="" width={24} height={24} />
                  </div>
                  <div className="left">
                    <p className="font-bold text-[14px] text-[#71747A] ">
                      {parent}
                    </p>
                    <p className="font-normal text-[18px] text-[#131722] ">
                      {unit}
                    </p>
                  </div>
                </div>
                <div className="containerBottom">
                  <div className="input w-full h-[56px]">
                    <input
                      className="w-full h-full pl-[16px] border rounded-[6px] border-[#DFE3EB] outline-none"
                      type="text"
                      placeholder="KA 22 EP 9990"
                      value={vehicleNo}
                      onChange={handleOnChange}
                      maxLength={15}
                    />
                  </div>
                </div>
              </div>
            </div>
            {validVehicle ? (
              <div>
                <div
                  className="button flex items-center justify-center bg-[#2962FF] border rounded-[6px] w-[152px] h-[56px]"
                  onClick={handleClick}
                >
                  <button className="text-white">CONTINUE</button>
                </div>
              </div>
            ) : (
              <div
                className="button flex items-center justify-center bg-[#2962FF] border rounded-[6px] w-[152px] h-[56px]"
                onClick={handleClick}
              >
                <button className="text-white">CONTINUE</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
