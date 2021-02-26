# React와 GraphQL을 이용한 게시판(Front-end)
## React, Apollo-client, react-router-dom을 이용하여 웹 페이지를 구상.  
  > React의 함수형 컴포넌트를 이용함  
  > Apollo-client로 백엔드의 서버와 연결. ([http://172.26.50.29:4000](https://github.com/SausageMania/React-Board/blob/main/src/index.js#L10))  
  > react-router-dom으로 [**/create**](https://github.com/SausageMania/React-Board/blob/main/src/App.js#L12), [**/update/:id**](https://github.com/SausageMania/React-Board/blob/main/src/App.js#L13) url을 연결함. 
## GraphQl-tag로 CRUD를 구현.
  > [create](https://github.com/SausageMania/React-Board/blob/main/src/pages/CreateBoard.js#L8)  
  > [read #1](https://github.com/SausageMania/React-Board/blob/main/src/pages/BoardList.js#L8)  
  > [read #2](https://github.com/SausageMania/React-Board/blob/main/src/pages/UpdateBoard.js#L9)  
  > [update](https://github.com/SausageMania/React-Board/blob/main/src/pages/UpdateBoard.js#L19)  
  > [delete](https://github.com/SausageMania/React-Board/blob/main/src/pages/UpdateBoard.js#L29)
## react-bootstrap의 Bootstrap4을 이용하여 기본 UI/UX를 구상.
  > [Table](https://github.com/SausageMania/React-Board/blob/main/src/pages/BoardList.js#L41) tag를 이용하여 게시판 홈페이지를 만듦.  
  > [Form](https://github.com/SausageMania/React-Board/blob/main/src/pages/UpdateBoard.js#L71) tag를 이용하여 user의 게시글 페이지 및 게시글 생성 페이지를 만듦.  
  > 

## 현재 문제점
  > graphql에 데이터가 반영되기 전에 페이지가 돌아가 lifeCycle이 정상적으로 작동하지 않음.

## 앞으로 남은 과제
  > pagination으로 게시글 나누기
  > 검색 기능으로 query 분류하여 웹에 띄우기
