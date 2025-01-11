import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import AppFunctional from "./AppFunctional"

// Write your tests here
test('renders the initial UI correctly', () => {
  render(<AppFunctional />);
  expect(screen.getByText('Coordinates (2, 2)')).toBeInTheDocument();
  expect(screen.getByText('You moved 0 times')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('type email')).toBeInTheDocument();
  expect(screen.getByText('LEFT')).toBeInTheDocument();
  expect(screen.getByText('UP')).toBeInTheDocument();
  expect(screen.getByText('RIGHT')).toBeInTheDocument();
  expect(screen.getByText('DOWN')).toBeInTheDocument();
  expect(screen.getByText('reset')).toBeInTheDocument();
});

test('updates coordinates correctly after moving up', () => {
  render(<AppFunctional />);
  const upButton = screen.getByText('UP');
  fireEvent.click(upButton);
  expect(screen.getByText('Coordinates (2, 1)')).toBeInTheDocument();
});

test('shows "You can\'t go up" when moving out of bounds', () => {
  render(<AppFunctional />);
  const upButton = screen.getByText('UP');
  fireEvent.click(upButton);
  fireEvent.click(upButton); 
  expect(screen.getByText("You can't go up")).toBeInTheDocument();
});

