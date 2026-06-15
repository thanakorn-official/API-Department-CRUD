const express = require("express");
const app = express();

app.use(express.json());

let users = [
  { id: 1, name: "Somsak" },
  { id: 2, name: "Somchai" },
];

app.get("/", (req, res) => {
  const userListHtml = users
    .map(
      (user) => `
    <li>
      ID: ${user.id} - Name: ${user.name} 
      <button onclick="deleteUser(${user.id})">ลบ</button>
    </li>
  `,
    )
    .join("");

  res.send(`
    <html>
      <head>
        <title>User Management</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding-top: 50px; }
          ul { list-style: none; padding: 0; }
          li { background: #f4f4f4; margin: 5px auto; padding: 10px; border-radius: 5px; display: flex; justify-content: space-between; width: 350px; }
          .form-box { margin-bottom: 20px; border: 1px solid #ccc; padding: 20px; display: inline-block; border-radius: 10px; }
        </style>
      </head>
      <body>
        <h1>ระบบจัดการผู้ใช้ Hee Kuy Tad</h1>
        <div class="form-box">
          <input type="text" id="userName" placeholder="พิมพ์ชื่อตรงนี้...">
          <button onclick="addUser()">เพิ่มผู้ใช้งาน</button>
        </div>
        <h3>รายชื่อพวก Hee Kuy Tad:</h3>
        <ul>${userListHtml}</ul>
        
        <script>
          function addUser() {
            const nameInput = document.getElementById('userName');
            const name = nameInput.value;
            if (!name) return alert("กรุณาพิมพ์ชื่อ");
            fetch('/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: name })
            }).then(() => window.location.reload());
          }

          function deleteUser(id) {
            fetch('/users/' + id, { method: 'DELETE' })
              .then(() => window.location.reload());
          }
        </script>
      </body>
    </html>
  `);
});

app.post("/users", (req, res) => {
  const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0;

  const newUser = {
    id: maxId + 1,
    name: req.body.name,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter((user) => user.id !== userId);
  res.send("Deleted");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
