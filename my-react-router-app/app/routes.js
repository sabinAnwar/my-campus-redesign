import pkg from "@react-router/dev/routes";
const { index, route } = pkg;

export default [
  {
    path: "/",
    file: "routes/home.jsx"
  },
  {
    path: "users",
    file: "routes/users.jsx",
    children: [
      {
        index: true,
        file: "routes/users._index.jsx"
      },
      {
        path: "new",
        file: "routes/users.new.jsx"
      },
      {
        path: ":userId",
        file: "routes/users.$userId.jsx"
      }
    ]
  }
];
