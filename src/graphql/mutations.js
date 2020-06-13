import { gql } from "apollo-boost";

export const CREATE_DATA_MUTATION = gql`
  mutation($email: String!, $title: String!, $radius: String!) {
    createData(email: $email, title: $title, radius: $radius) {
      data{
        id
        title
        radius
      }
    }
  }
`;


export const CREATE_USER_MUTATION = gql`
  mutation($email: String!) {
    createUser(email: $email) {
      user{
        username
        email
        dateJoined
      }
    }
  }
`;