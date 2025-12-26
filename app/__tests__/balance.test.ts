import request from "supertest";
import app from "../src/app";

describe("GET /balance", () => {
  it("should return standardized success response", async () => {
    const res = await request(app).get("/balance");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("balance");
    expect(res.body.data).toHaveProperty("currency");
  });

  it("should return standardized error for unknown route", async () => {
    const res = await request(app).get("/unknown");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty("error");
  });
});