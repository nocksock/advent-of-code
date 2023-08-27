fn main() {
    let input = include_str!("01.sample").split("\n\n");

    let mut result: Vec<i32> = input
        .map(|group| {
            group
                .trim()
                .split("\n")
                .map(|line| line.parse::<i32>().unwrap())
                .sum()
        })
        .collect();

    result.sort_by(|l, r| l.cmp(r).reverse());

    println!("A: {}", &result[0..1].into_iter().sum::<i32>());
    println!("B: {}", &result[0..3].into_iter().sum::<i32>());
}
