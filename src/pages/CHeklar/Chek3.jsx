import React, { useState } from "react";
import { Flex, Splitter, Typography, Button,Input,Select,InputNumber,Row,Col } from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    DeleteOutlined,
    CameraOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { SlCreditCard, SlActionUndo } from "react-icons/sl";
import { BsBoxArrowRight,} from "react-icons/bs";
import { BiLogoPaypal } from "react-icons/bi";
import { CiMoneyBill,CiReceipt,CiBarcode } from "react-icons/ci";
import Chek1 from "./Chek";
import Chek2 from "../CHeklar/Chek2";
import { Link } from "react-router-dom";

const Desc = (props) => (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Typography.Title
            type="secondary"
            level={5}
            style={{ whiteSpace: "nowrap" }}
        >
            {props.text}
        </Typography.Title>
    </Flex>
);

const selectBefore = (
  <Select defaultValue="add" style={{ width: 60 }}>
    <Option value="add">+</Option>
    <Option value="minus">-</Option>
  </Select>
);
const selectAfter = (
  <Select defaultValue="USD" style={{ width: 60 }}>
    <Option value="USD">$</Option>
    <Option value="EUR">€</Option>
    <Option value="GBP">£</Option>
    <Option value="CNY">¥</Option>
    <Option value="CNY">ЛВ</Option>
  </Select>
);



const Chek3 = () => (
    <Splitter style={{ height: 600, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <Splitter.Panel defaultSize="40%" min="20%" max="60%">
            <div className="Chek mt-1.5 flex text-emerald-600 text-shadow-lg/15">
                <h2 className="text-2xl ml-3 ">Chek 3 oynasi</h2>
                <Link className="ml-4 text-2xl flex" to="/Chek1">
                    Chek 1
                    <CiReceipt className="mt-1.5 ml-1" />
                </Link>
                <Link className="ml-4 text-2xl flex" to="/Chek2">
                    Chek 2
                    <CiReceipt className="mt-1.5 ml-1" />
                </Link>
            </div>
            <input
                type="text"
                className="mt-4.5 ml-5 w-3xs rounded-md border-2"
            />
            <Button className="ml-2" type="primary" icon={<SearchOutlined />}>
                Search
            </Button>

            <table className="w-130 rounded-md text-center mt-5 ml-5 border-2 border-solid border-gray-400">
                <thead className="bg-blue-700">
                    <tr>
                        <th className="text-amber-50 border border-gray-300 bg-blue-500">Rasmi</th>
                        <th className="text-amber-50 border border-gray-300 bg-blue-500">Tavar Nomi</th>
                        <th className="text-amber-50 border border-gray-300 bg-blue-500">Miqrodi</th>
                        <th className="text-amber-50 border border-gray-300 bg-blue-500">Narxi</th>
                        <th className="text-amber-50 border border-gray-300 bg-blue-500">add</th>
                        <th className="text-amber-50 border border-gray-300 bg-blue-500">delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300">
                            <CameraOutlined />
                        </td>
                        <td className="border border-gray-300">olma</td>
                        <td className="border border-gray-300">20</td>
                        <td className="border border-gray-300">15.000</td>
                        <td className="border border-gray-300">
                            {" "}
                            <Button type="link">
                                <PlusOutlined />
                            </Button>
                        </td>
                        <td className="border border-gray-300">
                            {" "}
                            <Button type="link">
                                <DeleteOutlined />
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <Link to="/cash" className="absolute flex left-60 top-7/8 ml-3 text-2xl text-pink-700">Kassa <BsBoxArrowRight className="mt-1.5 ml-1" /></Link>

        </Splitter.Panel>
        <Splitter.Panel>
           <Input className="w-70 mt-3 ml-5" placeholder="Search" />
         <Button className="ml-1" type="dashed" shape="circle" icon={<SearchOutlined />} />  
   
     <InputNumber className="mt-2.5 ml-3 w-45" addonBefore={selectBefore} addonAfter={selectAfter} defaultValue={100} />

 <table className="border-collapse border border-gray-400 ml-2 mt-3">
 
  <thead>
    <tr>
      <th className="border-b-4  border-gray-300 w-60 text-center bg-amber-600">Tavar Nomi</th>
      <th className="border-b-4  border-gray-300 w-40 text-center bg-amber-600">Miqrodi</th>
      <th className="border-b-4  border-gray-300 w-30 text-center bg-amber-600">Narxi</th>
       <th className="border-b-4  border-gray-300 w-30 text-center bg-amber-600">Chegirma</th>
    
  </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border-b-4  border-indigo-500  w-60 text-center">18+ PLUS</td>
      <td className="border-b-4  border-indigo-500  w-40 text-center">10 ta</td>
      <td className="border-b-4  border-indigo-500  w-30 text-center">10.000</td>
       <td className="border-b-4  border-indigo-500  w-30 text-center">20%</td>
    </tr>

    <tr>
      <td className="border-b-4  border-indigo-500  text-center">Non</td>
      <td className="border-b-4  border-indigo-500  text-center">4 ta</td>
      <td className="border-b-4  border-indigo-500  text-center">5.000</td>
       <td className="border-b-4  border-indigo-500  w-30 text-center">30%</td>
    </tr>
    <tr>
      <td className="border-b-4  border-indigo-500  text-center">Qaymoq</td>
      <td className="border-b-4  border-indigo-500  text-center">1ta 500gr</td>
      <td className="border-b-4  border-indigo-500  text-center">25.000</td>
      <td className="border-b-4  border-indigo-500  w-30 text-center">10%</td>
    </tr>
  </tbody>
</table>

<div className="pt-60">
<Button color="cyan" variant="solid" className="w-3xs ml-2 mt-2 h-15"> <CiReceipt />
Sotildi</Button>
<Button color="cyan" variant="solid" className="w-3xs ml-2 mt-2 h-15"> <SlActionUndo/>Qaytarish</Button>
<Button color="cyan" variant="solid" className="w-3xs ml-2 mt-2 h-15"><CiMoneyBill />Naqt pul</Button>
<Button color="cyan" variant="solid" className="w-3xs ml-2 mt-2 h-15"><SlCreditCard/>
Karta</Button>
<Button color="cyan" variant="solid" className="w-3xs ml-2 mt-2 h-15"> <BiLogoPaypal />Boshqa to'lov tizimi</Button>
<Button color="cyan" variant="solid" className="w-3xs ml-2 mt-2 h-15">QR-kod yaratish
<CiBarcode /></Button>

</div>


        </Splitter.Panel> 
    </Splitter>
);

export default Chek3;
