defmodule Day02Test do
  use ExUnit.Case
  doctest Day02

  test "solves sample" do
    {:ok, content} = File.read("../02.sample")
    assert 8 == Day02.solve content
  end

  # test "solves input" do
  #   {:ok, content} = File.read("../01.input")
  #   assert 2541 == Day02.solve content
  # end
end
