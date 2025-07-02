import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import StatusAlert from "react-status-alert";

import { useDispatch } from "react-redux";

import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Filter from "./components/Filter/Filter";
import DownloadPage from "./components/Download/DownloadPage";
import Admin from "./components/Admin/Admin";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Page404 from "./components/404/Page404";
import Search from "./components/Filter/Search";

import "./App.css";
import Axios from "axios";

export default function App() {
  const [isload, setisload] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      if (isload) {
        await fetchData(dispatch);
        setisload(false);
      }
    };
    getData();
  }, []);

  return (
    <div style={{ backgroundColor: "#020D18" }}>
      <Router>
        <Header />
        <StatusAlert />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/filter/:type" component={Filter} />
          <Route path="/download/:id" component={DownloadPage} />
          <Route exact path="/A_D_M_I_N" component={Admin} />
          <Route exact path="/A_D_M_I_N/Dashboard" component={Dashboard} />
          <Route path="/search/:search" component={Search} />
          <Route component={Page404} />
        </Switch>
      </Router>
    </div>
  );
}

// ✅ Absolute backend URL
//const BACKEND_URL = "https://movie-backend-z7ch.onrender.com";

const fetchData = async (dispatch) => {
  try {
    const allData = await (
      await Axios.post('https://movie-backend-z7ch.onrender.com/movie_data/fetch')
    ).data;

    const filterDataWithTimeStamp = Array.isArray(allData)
      ? await filterWithTimeStamp(allData)
      : [];

    await setAllMoviesData(filterDataWithTimeStamp, dispatch);
    await setNewMovies(filterDataWithTimeStamp, dispatch);
    await setBollywoodMovies(filterDataWithTimeStamp, dispatch);
    await setHollywoodMovies(filterDataWithTimeStamp, dispatch);
    await setSeries(filterDataWithTimeStamp, dispatch);
  } catch (error) {
    console.error("❌ Error fetching data:", error);
  }
};

const filterWithTimeStamp = async (allData) => {
  return allData.sort((a, b) => {
    return b.TimeStamp - a.TimeStamp;
  });
};

const setAllMoviesData = async (allData, dispatch) => {
  dispatch({ type: "ALL_MOVIE_DATA", data: allData });
};

const setNewMovies = async (allData, dispatch) => {
  dispatch({ type: "NEW_MOVIE_DATA", data: allData.slice(0, 8) });
};

const setBollywoodMovies = async (allData, dispatch) => {
  const bollywood = allData.filter((movie) => movie.Wood === "Bollywood");
  dispatch({ type: "BOLLYWOOD_MOVIE", data: bollywood });
};

const setHollywoodMovies = async (allData, dispatch) => {
  const hollywood = allData.filter((movie) => movie.Wood === "Hollywood");
  dispatch({ type: "HOLLYWOOD_MOVIE", data: hollywood });
};

const setSeries = async (allData, dispatch) => {
  const series = allData.filter((movie) => movie.Wood === "Series");
  dispatch({ type: "SERIES", data: series });
};
