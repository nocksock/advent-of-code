use clap::{Arg, Command};
mod day01;
mod day02;
mod day03;
mod utils;

fn cli() -> Command {
    Command::new("aoc")
        .about("Advent of Code")
        .arg(Arg::new("day").short('d').required(true).help("Day to run"))
        .arg(Arg::new("part-b").short('b').action(clap::ArgAction::SetTrue).help("Solve for part b"))
}

#[allow(dead_code)]
fn main() {
    let mut api = cli();
    let usage = api.render_usage();
    let matches = api.get_matches();
    let day: usize = matches.get_one::<String>("day").unwrap().parse().unwrap();

    match day {
        1 => println!("{:?}", day01::solve(utils::read_input("01.input"), matches.get_flag("part-b"))),
        2 => println!("{:?}", day02::solve(utils::read_input("02.input"), matches.get_flag("part-b"))),
        3 => println!("{:?}", day03::solve(utils::read_input("03.input"), matches.get_flag("part-b"))),
        _ => println!("{}", usage),
    }
}
