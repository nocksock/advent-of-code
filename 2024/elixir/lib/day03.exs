defmodule Aoc.Day03 do
  import NimbleParsec

  defparsec(
    :parse,
    repeat(
      choice([
        ignore(string("mul("))
        |> integer(max: 3)
        |> ignore(string(","))
        |> integer(max: 3)
        |> ignore(string(")"))
        |> reduce({Enum, :product, []}),
        ignore(utf8_char([]))
      ])
    )
    |> eos()
  )

  def solve(input) do
    {:ok, result, _, _, _, _} = parse(input)
    result |> Enum.sum()
  end
end

File.read!("../03.input")
|> Aoc.Day03.solve()
|> IO.puts()
