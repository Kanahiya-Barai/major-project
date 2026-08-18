Place raw CSV datasets for model training in this folder.

Supported filenames:
- `transaction.csv`
- `transaction_data.csv`
- `transaction_data_legacy.csv`

When you run `training/preprocess.py` without `--raw-path`, the pipeline automatically loads and combines every supported dataset file that exists here.
