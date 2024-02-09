export const getAdmin = (req, res) => {
  res.send({ name: "subha", email: "subha@gmail.com" });
};

export const loginAdmin = (req, res) => {
  res.send("Admin logged in successfully");
};
