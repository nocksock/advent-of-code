fn part_a(input: &str) -> i32 {
    let [a, b] = input
        .lines()
        .map(|line| parse_command(line))
        .reduce(|acc, cv| [acc[0] + cv[0], acc[1] + cv[1]])
        .unwrap();

    a * b
}

fn parse_command(input: &str) -> [i32; 2] {
    match input.split_once(" ").unwrap() {
        ("forward", num) => [num.parse::<i32>().unwrap(), 0],
        ("down", num) => [0, num.parse::<i32>().unwrap()],
        ("up", num) => [0, num.parse::<i32>().unwrap() * -1],
        (_, _) => panic!("not matched"),
    }
}

fn main() {
    let result = part_a(include_str!("../../../02.input"));
    println!("{:?}", result);
}

#[cfg(test)]
mod test {
    use crate::*;
    #[test]
    fn test_parse_command() {
        assert_eq!([5, 0], parse_command("forward 5"));
        assert_eq!([0, -5], parse_command("up 5"));
        assert_eq!([0, 5], parse_command("down 5"));
    }
    #[test]
    fn test_parse() {
        let result = part_a(include_str!("../../../02.sample"));
        assert_eq!(result, 150);
    }

    #[test]
    fn test_part_a_regression() {
        let result = part_a(include_str!("../../../02.input"));
        assert_eq!(result, 1488669);
    }
}
