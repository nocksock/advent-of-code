defmodule Day01 do
  def solve(input) do
    input 
      |> String.trim()
      |> String.split("\n")
      |> Enum.map(fn line -> 
          chars = String.to_charlist(line)
            |> Enum.filter(&(&1 >= 49 and &1 <= 59))
          (List.first(chars) - 48) * 10 + List.last(chars) - 48
        end)
      |> Enum.sum()
  end
end
