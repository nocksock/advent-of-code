defmodule Day02 do
  def solve(input) do
    input 
      |> String.trim()
      |> String.split("\n")
      |> Enum.flat_map(fn input -> String.split("") end)
  end
end
