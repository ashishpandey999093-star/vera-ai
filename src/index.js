import app from "./app.js";
import { loadDataset } from "./services/dataset.service.js";

const PORT = process.env.PORT || 4000;

loadDataset();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});