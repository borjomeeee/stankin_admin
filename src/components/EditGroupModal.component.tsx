import React, { useState } from "react";

import "./EditGroupModal.component.scss";

import LabeledInputComponent from "./LabeledInput.component";
import ButtonComponent from "./Button.component";

import { IGroup } from "../models/Group.model";
import { IInitialState } from "../redux/store";
import { connect, ConnectedProps } from "react-redux";

type IEditGroupModalComponent = {
  group: IGroup;
};

const EditGroupModalComponent = ({
  group,
  groups,
}: ConnectedProps<typeof connector> & IEditGroupModalComponent) => {
  const [groupTitle, setGroupTitle] = useState(group.title);
  const [groupTitleError, setGroupTitleError] = useState("");

  const onChangeEditGroupTitle = (value: string) => {
    if (groupTitleError) {
      setGroupTitleError("");
    }
    setGroupTitle(value);
  };

  const onSubmitEditGroup = () => {
    if (groupTitle !== "") {
      if (
        groups.filter((group: IGroup) => group.title === groupTitle)
          .length !== 0
      ) {
        setGroupTitleError("Такая группа уже существует");
        return;
      }

      if (!/[А-Яа-я]{3}-\d{2}-\d{2}/.test(groupTitle)) {
        setGroupTitleError("Шаблон группы ИДБ-01-01");
        return;
      }

      // createGroup(groupTitleError);
      setGroupTitle("");
    } else {
      setGroupTitleError("Введите название группы");
    }
  };

  return (
    <div className="edit-group">
      <div className="edit-group__items">
        <LabeledInputComponent
          label="Название группы"
          value={groupTitle}
          onChange={onChangeEditGroupTitle}
          error={groupTitleError}
          autoFocus
        />
      </div>

      <div className="edit-group__submit">
        <ButtonComponent label="Изменить" onClick={onSubmitEditGroup} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IInitialState) => ({
  groups: state.groups,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(EditGroupModalComponent);
