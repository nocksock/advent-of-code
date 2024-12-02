defmodule Day01Test do
  use ExUnit.Case
  doctest Day01

  test "solves sample" do
    {:ok, content} = File.read("../01.sample")
    assert 142 == Day01.solve content
  end

  test "solves input" do
    {:ok, content} = File.read("../01.input")
    assert 55090 == Day01.solve content
  end
end
