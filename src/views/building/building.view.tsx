import styled from "styled-components";
import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
  info: React.ReactNode;
}

export const BuildingView: FC<Props> = ({ children, info }) => {
  return (
    <Wrapper>
      <div></div>
      <div>{children}</div>
      <div>{info}</div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: 2px solid black;
  margin-bottom: 16px;
`;
