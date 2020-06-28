import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";

import "./Main.screen.scss";

import { IInitialState } from "../redux/store";

import MainFilterBar from "../components/MainFilterBar.component";
import MainGroupComponent from "../components/MainGroup.component";

import EditRemoveHOC from "../HOCs/EditRemove.HOC";

import { IGroup } from "../models/Group.model";
import { removeGroupAction } from "../actions/Groups.actions";
import ModalTemplate from "../templates/Modal.template";

const MainScreen = ({
  groups,
  mainScreen,

  removeGroup,
}: ConnectedProps<typeof connector>) => {
  // Handlers
  const onRemoveGroup = (groupId: string) => {
    removeGroup(groupId);
  };

  const MainGroups = () => (
    <div className="main__groups">
      {groups
        .filter((group: IGroup) =>
          group.title.startsWith(mainScreen.searchGroupText)
        )
        .map((group: IGroup) => (
          <EditRemoveHOC
            key={group.id}
            onEdit={() => console.log(`Edit group: ${group.id}`)}
            onRemove={() => onRemoveGroup(group.id)}
          >
            <Link
              to={{
                pathname: `/group/${group.id}`,
                state: { group },
              }}
            >
              <MainGroupComponent
                props={{
                  onClick: () => console.log(`Touched group: ${group.id}`),
                }}
                title={group.title}
              />
            </Link>
          </EditRemoveHOC>
        ))}
    </div>
  );
  return (
    <div className="main">
      <div className="filters">
        <MainFilterBar />
      </div>

      <div className="content main__content">
        <MainGroups />
      </div>

      <ModalTemplate title="Изменить" onClose={() => console.log("Модальное окно закрыто!")}>
        <div className="hello">Hello</div>
      </ModalTemplate>
    </div>
  );
};

const mapStateToProps = (state: IInitialState) => ({
  groups: state.groups,
  mainScreen: state.mainScreen,
});

const mapDispatchToProps = {
  removeGroup: (groupId: string) => removeGroupAction(groupId),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(MainScreen);
