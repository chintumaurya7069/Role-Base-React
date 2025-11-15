import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/table/DataTable";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  fetchGenreData,
  removeGenre,
} from "../../redux/slice/genre/genreAsyncThunk";
import GenreForm from "../../components/genreForm/GenreForm";
import { fetchAgeGroupData } from "../../redux/slice/ageGroup/ageGroupAsyncThunk";
import { clearError } from "../../redux/slice/genre/genreSlice";

const Genre = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { genre, error, loading, mainLoader, deleteLoading } = useSelector(
    (state) => state.genres
  );

  useEffect(() => {
    // dispatch(fetchAgeGroupData());
    // dispatch(fetchGenreData());
    dispatch(fetchGenreData());
  }, [dispatch]);

  useEffect(() => {
    if (
      error === "Invalid token" ||
      error === "Access denied. No token provided"
    ) {
      toast.error(error);
      setTimeout(() => {
        localStorage.removeItem("auth_token");
        dispatch(clearError());
        navigate("/login");
      }, 1000);
    } else if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      let hours = date.getHours();
      const amPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = String(date.getMinutes()).padStart(2, "0");
      //   const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${amPm}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  const columns = [
    {
      field: "#",
      header: "#",
      searchable: true,
    },
    {
      field: "name",
      header: "Genre Name",
      searchable: true,
    },
    {
      field: "createdOn",
      header: "Created Date & Time",
      searchable: true,
      body: (rowData) => <span>{formatDate(rowData.createdOn)}</span>,
    },
  ];
  const newGenre = Array.isArray(genre)
    ? genre.map((genre, index) => ({
        "#": index + 1,
        ...genre,
      }))
    : [];

  return (
    <DataTable
      title="Genres"
      columns={columns}
      data={newGenre || []}
      deleteData={async (id) => {
        try {
          await dispatch(removeGenre(id));
        } catch (error) {
          console.error("Failed to delete genre:", error);
        }
      }}
      FormComponent={GenreForm}
      loading={loading}
      exportButton={true}
      buttons={true}
      mainLoader={mainLoader}
      deleteLoading={deleteLoading}
      addButtonText="Add genre"
      currentModule="Genre"
    />
  );
};

export default Genre;
