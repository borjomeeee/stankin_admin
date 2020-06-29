import React, { useState, useMemo } from "react";
import { connect, ConnectedProps } from "react-redux";

import { IInitialState } from "../redux/store";

import useGroup, { time } from "../hooks/useGroup.hook";

import Search from "@material-ui/icons/Search";
import Room from "@material-ui/icons/Room";
import School from "@material-ui/icons/School";

import IconedInputComponent from "./IconedInput.component";
import LabeledInputComponent from "./LabeledInput.component";
import FilterSelectComponent from "./FilterSelect.component";
import DateMiniCardComponent from "./DateMiniCard.component";
import ButtonComponent from "./Button.component";

import { changeSearchLessonsNameAction } from "../actions/GroupScreen.actions";
import { createLessonAction } from "../actions/Lessons.actions";

import { IGroup } from "../models/Group.model";
import { ILessonTime, LessonTime } from "../models/LessonTime.model";

import { StudentGroupType, LessonType } from "../utils/enums";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

type IGroupRightBar = {
  group: IGroup;
};

const GroupRightBar = ({
  group,
  groupScreen,
  changeSearhLessonName,
  createLesson,
}: ConnectedProps<typeof connector> & IGroupRightBar) => {
  // States
  const [searchLessonInputText, setSearchLessonInputText] = useState(
    groupScreen.searchLessonText
  );

  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
  const [lessonDatesError, setLessonDatesError] = useState("");

  const {
    lessonTitle,
    lessonTitleError,
    handleChangeLessonTitle,
    checkValidLessonTitle,

    lessonRoom,
    lessonRoomError,
    handleChangeLessonRoom,
    checkValidLessonRoom,

    lessonTeacherName,
    lessonTeacherNameError,
    handleChangeLessonTeacherName,
    checkValidLessonTeacherName,

    lessonDates,
    lessonTypeData,
    studentGroupData,
    lessonTimeData,

    handleChangeLessonType,
    handleChangeStudentGroup,
    handleChangeLessonTime,
    handleAddLessonDate,
  } = useGroup();

  const onSearchLessonInputEnter = () => {
    if (searchLessonInputText !== groupScreen.searchLessonText)
      changeSearhLessonName(searchLessonInputText);
  };

  const checkValidLessonDates = (): boolean => {
    if (lessonDates.length === 0) {
      setLessonDatesError("Выберите хотя бы одну дату");
      console.log(1)
      return false;
    }
    return true;
  };

  const onAddLessonDate = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      handleAddLessonDate(date);

      if (lessonDatesError) {
        setLessonDatesError("");
      }
    }
  };

  const onAddLesson = () => {
    const lessonTime = time.get(lessonTimeData.selected);
    if (
      lessonTime &&
      checkValidLessonTitle() &&
      checkValidLessonRoom() &&
      checkValidLessonTeacherName() &&
      checkValidLessonDates()
    ) {
      createLesson(
        group.id,
        lessonTitle,
        studentGroupData.selected,
        lessonTypeData.selected,
        lessonDates,
        new LessonTime(lessonTime),
        lessonRoom,
        lessonTeacherName
      );
    }
  };

  // Icons
  const searchLessonTitleIcon = useMemo(() => {
    return <Search style={{ fontSize: 24 }} />;
  }, []);

  const roomLessonTitleIcon = useMemo(() => {
    return <Room style={{ fontSize: 24 }} />;
  }, []);

  const teacherLessonNameIcon = useMemo(() => {
    return <School style={{ fontSize: 24 }} />;
  }, []);

  const DatesCards = () => (
    <>
      {lessonDates.map((item: Date, index: number) => (
        <DateMiniCardComponent key={index} date={item} />
      ))}
    </>
  );

  return (
    <div className="right-bar">
      <div className="right-bar__section">
        <div className="section__label">Найти пару</div>

        <div className="section__child">
          <IconedInputComponent
            label="Название пары"
            value={searchLessonInputText}
            onChange={setSearchLessonInputText}
            onEnter={onSearchLessonInputEnter}
            icon={searchLessonTitleIcon}
          />
        </div>
      </div>

      <div className="right-bar__section">
        <div className="section__label">Добавить пару</div>

        <div className="section__child">
          <div className="right-bar__section-row">
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
        </div>

        <div className="section__child">
          <FilterSelectComponent
            itemSelected={lessonTypeData.selected}
            selectData={lessonTypeData.data}
            onChangeItem={handleChangeLessonType}
            label="Тип пары"
          />
        </div>

        <div className="section__child">
          <FilterSelectComponent
            itemSelected={lessonTimeData.selected}
            selectData={lessonTimeData.data}
            onChangeItem={handleChangeLessonTime}
            label="Время"
          />
        </div>

        <div className="section__child">
          <IconedInputComponent
            label="Аудитория"
            value={lessonRoom}
            onChange={handleChangeLessonRoom}
            icon={roomLessonTitleIcon}
            error={lessonRoomError}
          />
        </div>

        <div className="section__child">
          <IconedInputComponent
            label="Преподаватель"
            value={lessonTeacherName}
            onChange={handleChangeLessonTeacherName}
            icon={teacherLessonNameIcon}
            error={lessonTeacherNameError}
          />
        </div>

        <div className="section__child">
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

        <div className="section__child">
          <div className="right-bar__section-row">
            {lessonDatesError === "" ? (
              <DatesCards />
            ) : (
              <div className="right-bar__dates-card-error">
                {lessonDatesError}
              </div>
            )}
          </div>
        </div>

        <div className="section__child">
          <ButtonComponent label="Добавить" onClick={onAddLesson} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IInitialState) => ({
  groupScreen: state.groupScreen,
});

const mapDispatchToProps = {
  changeSearhLessonName: (value: string) =>
    changeSearchLessonsNameAction(value),
  createLesson: (
    groupId: string,
    lessonTitle: string,
    studentGroupType: StudentGroupType,
    lessonType: LessonType,
    lessonDates: Date[],
    time: ILessonTime,
    lessonPlace: string,
    teacher: string
  ) =>
    createLessonAction(
      groupId,
      lessonTitle,
      studentGroupType,
      lessonType,
      lessonDates,
      time,
      lessonPlace,
      teacher
    ),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(GroupRightBar);
