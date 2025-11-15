import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { BsDashCircleFill, BsGripVertical } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  editFigurine,
  fetchByIdFigurine,
  fetchFigurine,
  insertFigurine,
} from "../../redux/slice/figurine/figurineAsyncThunk";
import { ReactSortable } from "react-sortablejs";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import { ipOwn } from "./const";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { initialValues, validationSchema } from "./formikSchema";
import { fetchAgeGroupData } from "../../redux/slice/ageGroup/ageGroupAsyncThunk";
import { fetchGenreData } from "../../redux/slice/genre/genreAsyncThunk";
import { clearError } from "../../redux/slice/figurine/figurineSlice";

const FigurineForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { singleFigurineData, error } = useSelector((state) => state.figurines);
  // console.log("🚀 ~ FigurineForm ~ singleFigurineData:", singleFigurineData)
  const { genre } = useSelector((state) => state.genres);
  const { ageGroup } = useSelector((state) => state.ageGroups);

  useEffect(() => {
    dispatch(fetchAgeGroupData());
    dispatch(fetchGenreData());
    dispatch(fetchFigurine());
  }, []);
  useEffect(() => {
    if (
      error === "Invalid token" ||
      error === "Access denied. No token provided"
    ) {
      setTimeout(() => {
        localStorage.removeItem("auth_token");
        dispatch(clearError());
        navigate("/login");
      }, 1000);
    }
  }, [error]);
  const appendFileOrPath = async (formData, fileOrUrl, key) => {
    if (fileOrUrl instanceof File) {
      // If it's already a File, just append it
      formData.append(key, fileOrUrl, fileOrUrl.name);
    } else if (typeof fileOrUrl === "string" && fileOrUrl.trim() !== "") {
      formData.append(key, fileOrUrl);
    }
  };

  const onSubmit = async (values, { setSubmitting }) => {
    console.log("values :>> ", values);
    try {
      const formData = new FormData();

      // Handle non-playlist fields first
      Object.keys(values).forEach((key) => {
        if (key !== "playlist") {
          const value = values[key];

          if (value !== null && value !== undefined) {
            if (
              key === "ipDuration" &&
              Array.isArray(value) &&
              value.length === 2
            ) {
              const [startDate, endDate] = value;
              if (startDate instanceof Date && endDate instanceof Date) {
                const ipDurationObj = {
                  start: startDate.toISOString().split("T")[0],
                  end: endDate.toISOString().split("T")[0],
                };
                formData.append("ipDuration", JSON.stringify(ipDurationObj));
              }
            } else if (key === "genre" || key === "ageGroup") {
              // If editing existing data that might be comma-separated strings
              if (typeof value === "string") {
                formData.append(key, value); // Keep as is
              }
              // If new selection from MultiSelect (array of objects with _id)
              else if (Array.isArray(value)) {
                const ids = value.map((item) => item._id || item); // Handle both objects and strings
                formData.append(key, ids.join(","));
              }
            } else if (typeof value === "object" && value.value !== undefined) {
              formData.append(key, value.value);
            } else if (Array.isArray(value)) {
              value.forEach((item, index) => {
                if (typeof item === "object" && item.value !== undefined) {
                  formData.append(`${key}[${index}]`, item.value);
                } else {
                  formData.append(`${key}[${index}]`, item);
                }
              });
            } else {
              formData.append(key, value);
            }
          }
        }
      });

      for (
        let playlistIndex = 0;
        playlistIndex < values.playlist.length;
        playlistIndex++
      ) {
        const playlist = values.playlist[playlistIndex];

        // Handle playlist fields except audioFiles
        for (const key in playlist) {
          if (key !== "audioFiles") {
            const playlistValue = playlist[key];
            if (playlistValue === null || playlistValue === undefined) continue;

            // Handle sampleAudio (same as before)
            if (key === "sampleAudio") {
              if (playlistValue instanceof File) {
                formData.append(
                  `sampleAudio_${playlistIndex}`,
                  playlistValue,
                  playlistValue.name
                );
              } else if (typeof playlistValue === "string") {
                formData.append(
                  `playlist[${playlistIndex}][${key}]`,
                  playlistValue
                );
              }
            } else {
              formData.append(
                `playlist[${playlistIndex}][${key}]`,
                playlistValue
              );
            }
          }
        }

        // Handle audioFiles separately
        if (playlist.audioFiles && playlist.audioFiles.length > 0) {
          playlist.audioFiles.forEach((audioFile, audioIndex) => {
            if (audioFile.fileUrl) {
              // Preserve existing URL
              formData.append(
                `playlist[${playlistIndex}][audioFiles][${audioIndex}][fileUrl]`,
                audioFile.fileUrl
              );
            } else if (audioFile.file instanceof File) {
              // Append new file
              formData.append(`audioFiles_${playlistIndex}`, audioFile.file);
            }
          });
        }
        for (let [key, value] of formData.entries()) {
          console.log(key, value instanceof Blob ? "[BLOB]" : value);
        }
      }

      // Add ID if editing
      if (id) {
        formData.append("id", id);
        await dispatch(editFigurine({ id, formData }));
      } else {
        await dispatch(insertFigurine(formData));
      }

      navigate(-1);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchByIdFigurine(id));
    }
  }, [id, dispatch]);
  const countValidAudioFiles = (audioFiles) => {
    return audioFiles.filter(
      (item) =>
        item.file instanceof File ||
        (item.fileUrl && item.fileUrl.trim() !== "")
    ).length;
  };

  const TrackCountUpdater = ({ audioFiles, playlistIndex, setFieldValue }) => {
    useEffect(() => {
      const validCount = countValidAudioFiles(audioFiles);
      setFieldValue(`playlist.${playlistIndex}.noOfTracks`, validCount);
    }, [audioFiles]);

    return null; // It only runs logic; renders nothing
  };
  return (
    <div className="px-2 px-lg-5">
      <div className="card mt-5 mt-lg-4">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0 text-white">Figurine</h2>
          </div>
          <div className="card-body mt-3">
            <Formik
              initialValues={
                id
                  ? {
                      ...singleFigurineData,
                      genre: singleFigurineData.genre?.map((g) => g._id) || [],
                      ageGroup:
                        singleFigurineData.ageGroup?.map((g) => g._id) || [],
                      ipDuration: singleFigurineData.ipDuration
                        ? [
                            new Date(singleFigurineData.ipDuration.start),
                            new Date(singleFigurineData.ipDuration.end),
                          ]
                        : null,
                      playlist:
                        singleFigurineData.playlist?.map((playlist) => ({
                          ...playlist,
                          noOfTracks:
                            playlist.audioFiles?.filter((file) => file.fileUrl)
                              .length || 0,
                          sampleAudio: playlist.sampleAudio || null, // Ensure sampleAudio is preserved
                          audioFiles: playlist.audioFiles?.map((file) => ({
                            id: file._id || `audio-${Date.now()}`,
                            fileUrl: file.fileUrl || "",
                            file: null, // Initialize as null for new files
                          })) || [
                            {
                              id: `audio-${Date.now()}`,
                              file: null,
                              fileUrl: "",
                            },
                          ],
                        })) || initialValues.playlist,
                    }
                  : initialValues
              }
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={onSubmit}
            >
              {({ values, setFieldValue, errors }) => {
                return (
                  <Form>
                    <div className="mb-4">
                      <h4 className="mb-3 border-bottom pb-2">
                        Basic Information
                      </h4>

                      <div className="row mb-3">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="name" className="form-label fw-bold">
                            Product Name
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Enter Name"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="mb-3 col-md-4">
                          <label className="form-label fw-bold" htmlFor="ipOwn">
                            IP Own
                          </label>
                          <PrimeDropdown
                            id="ipOwn"
                            name="ipOwn"
                            value={values.ipOwn}
                            onChange={(e) => setFieldValue("ipOwn", e.value)}
                            options={ipOwn.map((ipOwn) => ({
                              label: ipOwn.name,
                              value: ipOwn.id,
                            }))}
                            placeholder="Select IP Own"
                            className="w-100"
                          />
                          <ErrorMessage
                            name="ipOwn"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label
                            htmlFor="ipOwner"
                            className="form-label fw-bold"
                          >
                            IP Owner
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="ipOwner"
                            name="ipOwner"
                            placeholder="Enter IP Owner"
                          />
                          <ErrorMessage
                            name="ipOwner"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label
                            className="form-label fw-bold"
                            htmlFor="ipDuration"
                          >
                            IP Duration
                          </label>

                          <Calendar
                            id="ipDuration"
                            name="ipDuration"
                            value={
                              values.ipDuration &&
                              typeof values.ipDuration === "object" &&
                              !Array.isArray(values.ipDuration) &&
                              values.ipDuration.start &&
                              values.ipDuration.end
                                ? [
                                    new Date(values.ipDuration.start),
                                    new Date(values.ipDuration.end),
                                  ]
                                : Array.isArray(values.ipDuration)
                                ? values.ipDuration
                                : null
                            }
                            onChange={(e) => {
                              if (
                                e.value &&
                                Array.isArray(e.value) &&
                                e.value.length === 2
                              ) {
                                setFieldValue("ipDuration", e.value);
                              } else {
                                setFieldValue("ipDuration", null);
                              }
                            }}
                            selectionMode="range"
                            readOnlyInput
                            hideOnRangeSelection
                            placeholder="Select Date"
                            className="w-100"
                            dateFormat="dd-mm-yy"
                          />

                          <ErrorMessage
                            name="ipDuration"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label
                            htmlFor="EANCode"
                            className="form-label fw-bold"
                          >
                            EAN Code
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="EANCode"
                            name="EANCode"
                            placeholder="Enter EAN Code"
                          />
                          <ErrorMessage
                            name="EANCode"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label
                            htmlFor="NFCRefID"
                            className="form-label fw-bold"
                          >
                            NFC Reference ID
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="NFCRefID"
                            name="NFCRefID"
                            placeholder="Enter NFC Reference"
                          />
                          <ErrorMessage
                            name="NFCRefID"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3 ">
                          <label htmlFor="genre" className="form-label fw-bold">
                            Genre
                          </label>
                          <div className="w-100 flex justify-content-center">
                            <MultiSelect
                              value={values.genre}
                              onChange={(e) => setFieldValue("genre", e.value)}
                              options={genre}
                              optionLabel="name"
                              optionValue="_id"
                              display="chip"
                              placeholder="Select Genre"
                              maxSelectedLabels={5}
                              className="w-100"
                            />
                          </div>
                          <ErrorMessage
                            name="genre"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3 ">
                          <label
                            htmlFor="ageGroup"
                            className="form-label fw-bold"
                          >
                            Age-Group
                          </label>
                          <div className="w-100 flex justify-content-center">
                            <MultiSelect
                              value={values.ageGroup}
                              onChange={(e) =>
                                setFieldValue("ageGroup", e.value)
                              }
                              options={ageGroup}
                              optionLabel="name"
                              optionValue="_id"
                              display="chip"
                              placeholder="Select Age"
                              maxSelectedLabels={5}
                              className="w-100"
                              optionTemplate={(option) => (
                                <div>{option.name}</div>
                              )}
                            />
                          </div>
                          <ErrorMessage
                            name="ageGroup"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label
                            htmlFor="figurineDescriptiveTagging"
                            className="form-label fw-bold"
                          >
                            Figurine Descriptive Tagging
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="figurineDescriptiveTagging"
                            name="figurineDescriptiveTagging"
                            placeholder="Enter Figurine Descriptive Tagging"
                          />
                          <ErrorMessage
                            name="figurineDescriptiveTagging"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="SKU" className="form-label fw-bold">
                            SKU Code
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="SKU"
                            name="SKU"
                            placeholder="Enter SKU code"
                          />
                          <ErrorMessage
                            name="SKU"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label
                            htmlFor="prefix"
                            className="form-label fw-bold"
                          >
                            Prefix
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="prefix"
                            name="prefix"
                            placeholder="Enter Prefix"
                          />
                          <ErrorMessage
                            name="prefix"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="media" className="form-label fw-bold">
                            Media
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="media"
                            name="media"
                            placeholder="Enter Media"
                          />
                          <ErrorMessage
                            name="media"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label
                            htmlFor="tracks"
                            className="form-label fw-bold"
                          >
                            Tracks
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="tracks"
                            name="tracks"
                            placeholder="Enter Tracks"
                          />
                          <ErrorMessage
                            name="tracks"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label
                            htmlFor="tracks"
                            className="form-label fw-bold"
                          >
                            Label 1
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="label1"
                            name="label1"
                            placeholder="Enter Label 1"
                          />
                          <ErrorMessage
                            name="tracks"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label
                            htmlFor="tracks"
                            className="form-label fw-bold"
                          >
                            Label 2
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="label2"
                            name="label2"
                            placeholder="Enter Label 2"
                          />
                          <ErrorMessage
                            name="tracks"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-12 mb-3">
                          <label
                            htmlFor="description"
                            className="form-label fw-bold"
                          >
                            Description
                          </label>
                          <Field
                            as="textarea"
                            className="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            placeholder="Enter Description"
                          />
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Playlists Section */}
                    <div className="mb-4">
                      <h4 className="mb-3 border-bottom pb-2">Play Lists</h4>
                      <FieldArray name="playlist">
                        {({ push: pushPlaylist, remove: removePlaylist }) => (
                          <div>
                            {values?.playlist?.map(
                              (playlist, playlistIndex) => {
                                const productName = singleFigurineData?.name;

                                return (
                                  <div
                                    key={playlistIndex}
                                    className="card mb-4 border-primary"
                                  >
                                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                      <h5 className="mb-0 text-primary">
                                        Play List {playlistIndex + 1}
                                      </h5>
                                      {playlistIndex > 0 && (
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm"
                                          onClick={() =>
                                            removePlaylist(playlistIndex)
                                          }
                                        >
                                          <i className="bi bi-trash"></i> Remove
                                          Playlist
                                        </button>
                                      )}
                                    </div>
                                    <div className="card-body mt-3">
                                      <div className="row mb-3">
                                        <div className="col-md-6 mb-3">
                                          <label
                                            htmlFor={`playlist.${playlistIndex}.folderName`}
                                            className="form-label fw-bold"
                                          >
                                            Folder Name
                                          </label>
                                          <Field
                                            type="text"
                                            className="form-control"
                                            id={`playlist.${playlistIndex}.folderName`}
                                            name={`playlist.${playlistIndex}.folderName`}
                                            placeholder="Enter Folder Name"
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setFieldValue(
                                                `playlist.${playlistIndex}.folderName`,
                                                value
                                              );
                                              setFieldValue(
                                                `playlist.${playlistIndex}.audioFileUrl`,
                                                `https://admin--frontend.vercel.app/assets/audio/${value}`
                                              );
                                            }}
                                          />
                                          <ErrorMessage
                                            name={`playlist.${playlistIndex}.folderName`}
                                            component="div"
                                            className="text-danger small"
                                          />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                          <label
                                            htmlFor={`playlist.${playlistIndex}.version`}
                                            className="form-label fw-bold"
                                          >
                                            Version
                                          </label>
                                          <Field
                                            type="text"
                                            className="form-control"
                                            id={`playlist.${playlistIndex}.version`}
                                            name={`playlist.${playlistIndex}.version`}
                                            placeholder="Enter Version"
                                            value={
                                              playlist.version ||
                                              (playlistIndex + 1).toString()
                                            }
                                            disabled
                                          />
                                          <ErrorMessage
                                            name={`playlist.${playlistIndex}.version`}
                                            component="div"
                                            className="text-danger small"
                                          />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                          <label
                                            htmlFor={`playlist.${playlistIndex}.noOfTracks`}
                                            className="form-label fw-bold"
                                          >
                                            Number of Tracks
                                          </label>
                                          <Field
                                            type="number"
                                            className="form-control"
                                            id={`playlist.${playlistIndex}.noOfTracks`}
                                            name={`playlist.${playlistIndex}.noOfTracks`}
                                            readOnly
                                          />
                                          <ErrorMessage
                                            name={`playlist.${playlistIndex}.noOfTracks`}
                                            component="div"
                                            className="text-danger small"
                                          />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                          <label
                                            htmlFor={`playlist.${playlistIndex}.sampleAudio`}
                                            className="form-label fw-bold"
                                          >
                                            Sample Audio
                                          </label>
                                          <div className="input-group">
                                            <button
                                              className="custom-btn-file"
                                              type="button"
                                              onClick={() =>
                                                document
                                                  .getElementById(
                                                    `playlist.${playlistIndex}.sampleAudio`
                                                  )
                                                  .click()
                                              }
                                            >
                                              Choose file
                                            </button>
                                            <input
                                              type="text"
                                              className="form-control custom-input-file"
                                              readOnly
                                              value={
                                                playlist.sampleAudio instanceof
                                                File
                                                  ? playlist.sampleAudio.name
                                                  : typeof playlist.sampleAudio ===
                                                    "string"
                                                  ? playlist.sampleAudio
                                                      .split("/")
                                                      .pop()
                                                  : "No file chosen"
                                              }
                                              placeholder="No file chosen"
                                            />
                                            <input
                                              type="file"
                                              id={`playlist.${playlistIndex}.sampleAudio`}
                                              name={`playlist.${playlistIndex}.sampleAudio`}
                                              accept="audio/*"
                                              onChange={(event) => {
                                                const file =
                                                  event.currentTarget.files[0];
                                                if (file) {
                                                  setFieldValue(
                                                    `playlist.${playlistIndex}.sampleAudio`,
                                                    file
                                                  );
                                                }
                                              }}
                                              style={{ display: "none" }}
                                            />
                                            {/* Add hidden input to preserve URL when no new file is selected */}
                                            {typeof playlist.sampleAudio ===
                                              "string" && (
                                              <input
                                                type="hidden"
                                                name={`playlist.${playlistIndex}.sampleAudioUrl`}
                                                value={playlist.sampleAudio}
                                              />
                                            )}
                                          </div>
                                          <ErrorMessage
                                            name={`playlist.${playlistIndex}.sampleAudio`}
                                            component="div"
                                            className="text-danger small"
                                          />
                                        </div>

                                        <div className="col-md-12 mb-3">
                                          <label
                                            htmlFor={`playlist.${playlistIndex}.audioFileUrl`}
                                            className="form-label fw-bold"
                                          >
                                            Audio File URL
                                          </label>
                                          <Field
                                            value={`https://superbuddybuck.s3.ap-south-1.amazonaws.com/audio/${productName}/${playlist.folderName}`}
                                            type="text"
                                            className="form-control"
                                            id={`playlist.${playlistIndex}.audioFileUrl`}
                                            name={`playlist.${playlistIndex}.audioFileUrl`}
                                            placeholder="Enter Audio File URL"
                                            disabled
                                          />
                                          <ErrorMessage
                                            name={`playlist.${playlistIndex}.audioFileUrl`}
                                            component="div"
                                            className="text-danger small"
                                          />
                                        </div>

                                        <div className="col-12 mb-3">
                                          <label className="form-label fw-bold">
                                            Audio File
                                          </label>
                                          <FieldArray
                                            name={`playlist.${playlistIndex}.audioFiles`}
                                          >
                                            {({
                                              push: pushDownloadLink,
                                              remove: removeDownloadLink,
                                              form: { values, setFieldValue },
                                            }) => {
                                              const audioFiles =
                                                values.playlist[playlistIndex]
                                                  .audioFiles || [];

                                              return (
                                                <div>
                                                  <TrackCountUpdater
                                                    audioFiles={audioFiles}
                                                    playlistIndex={
                                                      playlistIndex
                                                    }
                                                    setFieldValue={
                                                      setFieldValue
                                                    }
                                                  />
                                                  <ReactSortable
                                                    list={audioFiles.map(
                                                      (item) => ({
                                                        ...item,
                                                      })
                                                    )}
                                                    setList={(newList) => {
                                                      setFieldValue(
                                                        `playlist.${playlistIndex}.audioFiles`,
                                                        newList
                                                      );
                                                    }}
                                                    className="drag-handle"
                                                    handle=".drag-handle"
                                                    animation={150}
                                                    fallbackOnBody={true}
                                                    swapThreshold={0.65}
                                                    ghostClass="sortable-ghost"
                                                    chosenClass="sortable-chosen"
                                                    dragClass="sortable-drag"
                                                  >
                                                    {audioFiles.map(
                                                      (link, linkIndex) => (
                                                        <div
                                                          key={
                                                            link.id ||
                                                            link._id ||
                                                            `audio-${linkIndex}`
                                                          }
                                                          className="mb-3 sortable-item"
                                                        >
                                                          <div className="input-group">
                                                            <button
                                                              className="custom-btn-file"
                                                              type="button"
                                                              onClick={() =>
                                                                document
                                                                  .getElementById(
                                                                    `playlist.${playlistIndex}.audioFiles.${linkIndex}`
                                                                  )
                                                                  ?.click()
                                                              }
                                                            >
                                                              Choose file
                                                            </button>

                                                            <input
                                                              type="text"
                                                              className="form-control custom-input-file"
                                                              readOnly
                                                              value={
                                                                link.file
                                                                  ? link.file instanceof
                                                                    File
                                                                    ? link.file
                                                                        .name
                                                                    : ""
                                                                  : link.fileUrl
                                                                  ? link.fileUrl
                                                                      .split(
                                                                        "/"
                                                                      )
                                                                      .pop()
                                                                  : "No file chosen"
                                                              }
                                                              placeholder="No file chosen"
                                                              onClick={() =>
                                                                document
                                                                  .getElementById(
                                                                    `playlist.${playlistIndex}.audioFiles.${linkIndex}`
                                                                  )
                                                                  ?.click()
                                                              }
                                                            />
                                                            <input
                                                              type="file"
                                                              id={`playlist.${playlistIndex}.audioFiles.${linkIndex}`}
                                                              name={`playlist.${playlistIndex}.audioFiles.${linkIndex}.file`}
                                                              onChange={(
                                                                event
                                                              ) => {
                                                                const file =
                                                                  event
                                                                    .currentTarget
                                                                    .files[0];
                                                                if (file) {
                                                                  const updatedAudioFiles =
                                                                    [
                                                                      ...audioFiles,
                                                                    ];
                                                                  updatedAudioFiles[
                                                                    linkIndex
                                                                  ] = {
                                                                    ...updatedAudioFiles[
                                                                      linkIndex
                                                                    ],
                                                                    file: file,
                                                                    fileUrl: "", // reset old URL when new file selected
                                                                  };
                                                                  setFieldValue(
                                                                    `playlist.${playlistIndex}.audioFiles`,
                                                                    updatedAudioFiles
                                                                  );
                                                                }
                                                              }}
                                                              accept="audio/*"
                                                              style={{
                                                                display: "none",
                                                              }}
                                                            />

                                                            {audioFiles.length >
                                                              1 && (
                                                              <button
                                                                type="button"
                                                                className="btn btn-outline-danger"
                                                                onClick={() => {
                                                                  const updatedAudioFiles =
                                                                    [
                                                                      ...audioFiles,
                                                                    ];
                                                                  updatedAudioFiles.splice(
                                                                    linkIndex,
                                                                    1
                                                                  ); // remove one item
                                                                  setFieldValue(
                                                                    `playlist.${playlistIndex}.audioFiles`,
                                                                    updatedAudioFiles
                                                                  );
                                                                  setFieldValue(
                                                                    `playlist.${playlistIndex}.noOfTracks`,
                                                                    updatedAudioFiles.length
                                                                  );
                                                                }}
                                                              >
                                                                <BsDashCircleFill />
                                                              </button>
                                                            )}
                                                          </div>

                                                          <ErrorMessage
                                                            name={`playlist.${playlistIndex}.audioFiles`}
                                                            component="div"
                                                            className="text-danger small"
                                                          />
                                                        </div>
                                                      )
                                                    )}
                                                  </ReactSortable>
                                                  <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm mt-2"
                                                    onClick={() => {
                                                      const newAudioFiles = [
                                                        ...audioFiles,
                                                        {
                                                          id: `audio-${Date.now()}`,
                                                          file: null,
                                                          fileUrl: "",
                                                        },
                                                      ];
                                                      setFieldValue(
                                                        `playlist.${playlistIndex}.audioFiles`,
                                                        newAudioFiles
                                                      );
                                                      setFieldValue(
                                                        `playlist.${playlistIndex}.noOfTracks`,
                                                        newAudioFiles.length
                                                      );
                                                    }}
                                                  >
                                                    <i className="bi bi-plus-circle"></i>{" "}
                                                    Add Audio File
                                                  </button>
                                                </div>
                                              );
                                            }}
                                          </FieldArray>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                            <button
                              type="button"
                              className="btn btn-success mb-4"
                              onClick={() => {
                                const nextVersion =
                                  values.playlist.length > 0
                                    ? Math.max(
                                        ...values.playlist.map((p) =>
                                          parseInt(p.version || 1)
                                        )
                                      ) + 1
                                    : 1;
                                pushPlaylist({
                                  sampleAudio: null,
                                  folderName: "",
                                  noOfTracks: 1,
                                  DefaultVersion: nextVersion.toString(), // Set the incremented version,
                                  audioFileUrl: "",
                                  audioFiles: [
                                    { id: Date.now(), file: null, url: "" },
                                  ],
                                });
                              }}
                            >
                              <i className="bi bi-plus-circle"></i> Add Another
                              Playlist
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                    <div className="d-grid gap-2">
                      <div className="d-flex gap-3 justify-content-center">
                        <button
                          type="button"
                          className="col-2 btn btn-primary btn-lg"
                          onClick={() => navigate(-1)}
                        >
                          <i className="bi bi-check-circle"></i> Cancel
                        </button>
                        <button
                          type="submit"
                          // onClick={onSubmit}
                          className="col-2 btn btn-primary btn-lg"
                        >
                          <i className="bi bi-check-circle"></i> Submit Form
                        </button>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigurineForm;
