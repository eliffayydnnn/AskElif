import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function renderProtectedRoute(initialPath = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("token yokken login sayfasına yönlendirir", () => {
    renderProtectedRoute();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("token varken korumalı sayfaya erişim verir", () => {
    localStorage.setItem("token", "valid-token");

    renderProtectedRoute();

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("token silindikten sonra erişim engellenir", () => {
    localStorage.setItem("token", "valid-token");
    renderProtectedRoute();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();

    localStorage.removeItem("token");
    renderProtectedRoute();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
