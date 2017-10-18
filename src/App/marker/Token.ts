// MIT © 2017 azu
export interface Token {
    word_id: number; // 辞書内での単語ID
    word_type: string; // 単語タイプ(辞書に登録されている単語ならKNOWN, 未知語ならUNKNOWN)
    word_position: number; // 単語の開始位置
    surface_form: string; // 表層形
    pos: string; // 品詞
    pos_detail_1: string; // 品詞細分類1
    pos_detail_2: string; // 品詞細分類2
    pos_detail_3: string; // 品詞細分類3
    conjugated_type: string; // 活用型
    conjugated_form: string; // 活用形
    basic_form: string; // 基本形
    reading: string; // 読み
    pronunciation: string; // 発音
}