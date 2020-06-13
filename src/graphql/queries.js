import { gql } from "apollo-boost";

export const GET_MYDATA_QUERY = gql`
query($email: String!) {
  myData(email: $email) {
    id
    title
    radius
  }
}
`;
