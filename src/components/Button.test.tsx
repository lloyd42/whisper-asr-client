import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
	test("renders button with text", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText("Click me")).toBeInTheDocument();
	});
});
