import React, { useMemo, useState } from "react";

import "./EditLessonModal.component.scss";

import { ILesson } from "../models/Lesson.model";

import useLesson, { time } from "../hooks/useLesson.hook";

import LabeledInputComponent from "./LabeledInput.component";
import FilterSelectComponent from "./FilterSelect.component";
import IconedInputComponent from "./IconedInput.component";
import DateMiniCardComponent from "./DateMiniCard.component";

import Room from "@material-ui/icons/Room";
import School from "@material-ui/icons/School";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ButtonComponent from "./Button.component";

type IEditLessonModalComponent = {
  lesson: ILesson;
  onSubmit: () => void;
};

const EditLessonModalComponent = ({
  lesson,
  onSubmit,
}: IEditLessonModalComponent) => {
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));

  const {
    lessonTitle,
    lessonTitleError,
    // setLessonTitleError,
    handleChangeLessonTitle,
    checkValidLessonTitle,

    lessonRoom,
    lessonRoomError,
    // setLessonRoomError,
    handleChangeLessonRoom,
    checkValidLessonRoom,

    lessonTeacherName,
    lessonTeacherNameError,
    // setLessonTeacherNameError,
    handleChangeLessonTeacherName,
    checkValidLessonTeacherName,

    lessonDates,
    lessonDatesError,
    setLessonDatesError,
    handleAddLessonDate,
    handleRemoveLessonDate,
    checkValidLessonDates,

    lessonTypeData,
    studentGroupData,
    lessonTimeData,

    handleChangeLessonType,
    handleChangeStudentGroup,
    handleChangeLessonTime,
  } = useLesson(lesson);

  // Handlers
  const onAddLessonDate = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      handleAddLessonDate(date);

      if (lessonDatesError) {
        setLessonDatesError("");
      }
    }
  };

  const onSaveLesson = () => {
    const lessonTime = time.get(lessonTimeData.selected);
    if (
      lessonTime &&
      checkValidLessonTitle() &&
      checkValidLessonRoom() &&
      checkValidLessonTeacherName() &&
      checkValidLessonDates()
    ) {
      // SAVE LESSON
      console.log("Пара сохранена");
      onSubmit();
    }
  };

  // Icons
  const roomLessonTitleIcon = useMemo(() => {
    return <Room style={{ fontSize: 24 }} />;
  }, []);

  const teacherLessonNameIcon = useMemo(() => {
    return <School style={{ fontSize: 24 }} />;
  }, []);

  const DatesCards = () => (
    <>
      {lessonDates.map((item: Date, index: number) => (
        <DateMiniCardComponent
          key={index}
          date={item}
          onRemove={handleRemoveLessonDate.bind(null, item)}
        />
      ))}
    </>
  );

  return (
    <div className="modal__edit-lesson">
      <div className="edit-lesson__section-row">
        <LabeledInputComponent
          label="Название пары"
          value={lessonTitle}
          onChange={handleChangeLessonTitle}
          error={lessonTitleError}
        />

        <FilterSelectComponent
          itemSelected={studentGroupData.selected}
          selectData={studentGroupData.data}
          onChangeItem={handleChangeStudentGroup}
          label="Группа"
        />
      </div>

      <div className="edit-lesson__section">
        <FilterSelectComponent
          itemSelected={lessonTypeData.selected}
          selectData={lessonTypeData.data}
          onChangeItem={handleChangeLessonType}
          label="Тип пары"
        />
      </div>

      <div className="edit-lesson__section">
        <FilterSelectComponent
          itemSelected={lessonTimeData.selected}
          selectData={lessonTimeData.data}
          onChangeItem={handleChangeLessonTime}
          label="Время"
        />
      </div>

      <div className="edit-lesson__section">
        <IconedInputComponent
          label="Аудитория"
          value={lessonRoom}
          onChange={handleChangeLessonRoom}
          icon={roomLessonTitleIcon}
          error={lessonRoomError}
        />
      </div>

      <div className="edit-lesson__section">
        <IconedInputComponent
          label="Преподаватель"
          value={lessonTeacherName}
          onChange={handleChangeLessonTeacherName}
          icon={teacherLessonNameIcon}
          error={lessonTeacherNameError}
        />
      </div>

      <div className="edit-lesson__section">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Выберите дату"
            format="dd/MM/yyyy"
            value={selectedDate}
            onChange={onAddLessonDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            fullWidth
          />
        </MuiPickersUtilsProvider>
      </div>

      <div className="edit-lesson__section-dates">
        {lessonDatesError === "" ? (
          <DatesCards />
        ) : (
          <div className="error-message">
            {lessonDatesError}
          </div>
        )}
      </div>

      <div className="edit-lesson__section">
        <ButtonComponent label="Добавить" onClick={onSaveLesson} />
      </div>
    </div>
  );
};

export default EditLessonModalComponent;
