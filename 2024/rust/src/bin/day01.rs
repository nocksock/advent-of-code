fn part_a(input: &str) -> i32 {
    let mut input = input
        .lines()
        .map(|line| {
            str::split(line, "   ")
                .map(|num| num.parse::<i32>().unwrap())
                .collect::<Vec<_>>()
        })
        .fold([Vec::<i32>::new(), Vec::<i32>::new()], |mut acc, e| {
            acc[0].push(*e.get(0).unwrap());
            acc[1].push(*e.get(1).unwrap());
            acc
        });

    input.iter_mut().for_each(|list| list.sort());

    return (0..input[0].len())
        .map(|i| (input[0][i] - input[1][i]).abs())
        .reduce(|acc, n| acc + n)
        .unwrap();
}

fn main() {
    let result = part_a(include_str!("../../../01.input"));
    println!("{:?}", result);
}

#[cfg(test)]
mod test {
    use crate::part_a;
    #[test]
    fn test_parse() {
        let result = part_a(include_str!("../../../01.sample"));
        assert_eq!(result, 11);
    }
}
