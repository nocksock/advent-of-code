defmodule Aoc.Day1 do
  def part_a(input) do
    input
    |> String.trim()
    |> String.split("\n")
    |> Stream.map(fn row ->
      row
      |> String.trim()
      |> String.split(" ")
      |> Stream.map(&String.to_integer/1)
      |> Stream.chunk_every(2, 1, :discard)
      |> Stream.map(fn [a, b] -> a - b end)
      |> Stream.chunk_every(2, 1, :discard)
      |> Stream.map(fn
        [a, b] ->
          abs(a) in 1..3 and abs(b) in 1..3 and ((a > 0 and b > 0) or (a < 0 and b < 0))
      end)
      |> Enum.all?()
    end)
    |> Enum.filter(& &1)
    |> length()
  end
end

File.read!("../02.input")
|> AocDay1.part_a()
|> IO.puts()
