"use client"

// Hago uso de la declaración "use client" para no tener inconvenientes al usar los React hooks con NextJs 

import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import '../app/styles/styles.css'

//Variables de estado

export default function Home() {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [totalToPay, setTotalToPay] = useState(0);

//Uso del useEffect para hacer el método fetch y conectarme al API con una promesa. 
//Uso del try catch para intentar hacer fetch o mostrar el error en consola en caso de que ocurra. 
//La promesa devuelve un response.json, lo convierto a una variable useState data y setData para traer el array de receivable y poder entrar a el. 

  useEffect(() => {
    try {
      fetch("http://54.242.212.77:8080/mobilia-test/ws/Extra?operation=getInvoicesExternal&documentType=CC&documentCode=1095833961")
      .then((response) => response.json())
      .then((data) => setData(data.receivables))
    } catch(error) {
      console.error("Error fetching data:", error);
    }
  }, []);

// miro en consola que esté el array data 
  console.log(data);

//Creo la variable filteredData que va a aplicar el método filter sobre data, luego va a devolver cada itemque tenga el elemento contractCode y lo llamo filterValue; ese mismo filtervalue es el value del input en la renderización

//Adentro del return, con setFilterValue manejo el estado del valor que entre al input para estar mostrando o quitando si cumple con el contractCode

//Creo funcion flecha totalaPagar que toma las variables totalOutstandingBalance y totalPenaltyValue y las igualo a 0

//Hago un foreach del array filteredData en el que hago una funcion flecha, tomo item como parametro y adentro declaro las variables totalOutstandingBalance con el valor que tenga item.outstandingBalance, que es el valor que viene del arreglo

  const filteredData = data.filter(
    (item) => item.contractCode.includes(filterValue)
  );

  const totalaPagar = () => {
    let totalOutstandingBalance = 0;
    let totalPenaltyValue = 0;

    filteredData.forEach((item) => {
      totalOutstandingBalance += item.outstandingBalance;
      totalPenaltyValue += item.penaltyValue;
    });
console.log(totalOutstandingBalance, totalPenaltyValue)
    return totalOutstandingBalance - totalPenaltyValue;
  };

  useEffect(() => {
    const filteredData = data.filter((item) => item.contractCode.includes(filterValue));
    setTotalToPay(totalaPagar(filteredData));
  }, [data, filterValue]);

// En la línea 80 llamo la constante filtered data que usa el metodo de array .filter para traer el filterValue; lo mapeo y devuelvo item por cada posición.
// Imprimo el item iterador con su valor del modelo de datos y lo pinto en cada celda de la tabla

const format = new Intl.NumberFormat('es-ES')

  return (
    <main className='container'>
      <Head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
      </Head>
      <div className='card shadow mt-5 mb-5 p-5' style={{borderRadius: '22px'}}>
      <h1 className='title my-5 fw-bold fs-1 text-center'> Fetching de datos </h1>
      <input
        className='container-fluid text-black fw-bold shadow w-50 text-center my-5 p-1 fs-5 input' style={{borderRadius: '22px'}}
        type="text"
        placeholder="Ingrese codigo de Contrato asociado"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <div className='table-responsive'>
      <table className="table table-bordered shadow table-striped table-hover fs-5">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID Cartera</th>
            <th scope="col">Fecha Vencimiento</th>
            <th scope="col">Saldo Pendiente</th>
            <th scope="col">Es temporal?</th>
            <th scope="col">Contrato Asociado</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.receivableId}>
              <th scope="row">{index + 1}</th>
              <td>{item.receivableId}</td>
              <td>{item.dueDate}</td>
              <td>{format.format(item.outstandingBalance)}</td>
              <td>{item.isTempVoice ? "Es temporal" : "No es temporal"}</td>
              <td>{item.contractCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      <p className="my-5 p-5 fw-bold text-end fs-3">Total a pagar de saldos pendientes: {format.format(totalToPay)}</p>
    </div>
    </main>
  );
}
