use clap::{Arg, Command};
mod day01;
mod utils;

fn cli() -> Command {
    Command::new("aoc")
        .about("Advent of Code")
        .subcommand_required(true)
        .subcommand(Command::new("1").arg(Arg::new("part b").short('b').action(clap::ArgAction::SetTrue)))
}

#[allow(dead_code)]
fn main() {
    let mut api = cli();
    let usage = api.render_usage();
    let matches = api.get_matches();

    match matches.subcommand() {
        _ => println!("{}", usage),
    }
}
